import { onSchedule } from 'firebase-functions/v2/scheduler';
import { admin, db } from './firebase';

function getTodayDateKeyIST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export const sendDailyReminder = onSchedule(
  { schedule: '0 22 * * *', timeZone: 'Asia/Jerusalem' },
  async () => {
    const todayKey = getTodayDateKeyIST();

    const workoutDoc = await db.collection('workoutsByDate').doc(todayKey).get();
    if (!workoutDoc.exists) {
      console.log(`No workout for ${todayKey}, skipping reminder`);
      return;
    }

    const usersSnapshot = await db
      .collection('users')
      .where('fcmToken', '!=', null)
      .get();

    if (usersSnapshot.empty) {
      console.log('No users with FCM tokens');
      return;
    }

    const completionsSnapshot = await db
      .collection('workoutCompletions')
      .where('dateKey', '==', todayKey)
      .where('completed', '==', true)
      .get();

    const completedUids = new Set(
      completionsSnapshot.docs.map((doc) => doc.data().uid)
    );

    const tokens: string[] = [];
    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (!completedUids.has(doc.id) && data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length === 0) {
      console.log('All users with tokens have completed today');
      return;
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: 'של״ז בכושר 💪',
        body: 'לא לשכוח את האימון היומי! נשארו עוד שעתיים.',
      },
      webpush: { fcmOptions: { link: '/home' } },
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(
      `Sent ${response.successCount} notifications, ${response.failureCount} failed`
    );

    // Remove permanently-invalid tokens so they don't accumulate
    const staleTokenCleanups: Promise<void>[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;
        if (
          errorCode === 'messaging/registration-token-not-registered' ||
          errorCode === 'messaging/invalid-registration-token'
        ) {
          const staleToken = tokens[idx];
          const userDoc = usersSnapshot.docs.find((d) => d.data().fcmToken === staleToken);
          if (userDoc) {
            staleTokenCleanups.push(
              userDoc.ref.update({
                fcmToken: admin.firestore.FieldValue.delete(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              }).then(() => undefined)
            );
          }
        }
      }
    });

    if (staleTokenCleanups.length > 0) {
      await Promise.all(staleTokenCleanups);
      console.log(`Cleaned up ${staleTokenCleanups.length} stale FCM tokens`);
    }
  }
);
