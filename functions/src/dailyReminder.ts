import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { admin, db } from './firebase';
import { getTodayDateKeyIST } from './shared/dates';

export const sendDailyReminder = onSchedule(
  { schedule: '0 22 * * *', timeZone: 'Asia/Jerusalem' },
  async () => {
    const todayKey = getTodayDateKeyIST();
    const logRef = db.collection('notificationLogs').doc(todayKey);

    const workoutDoc = await db.collection('workoutsByDate').doc(todayKey).get();
    if (!workoutDoc.exists) {
      logger.info('No workout scheduled, skipping reminder', { dateKey: todayKey });
      await logRef.set({
        dateKey: todayKey,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        skippedReason: 'no_workout',
        targetedCount: 0,
        successCount: 0,
        failureCount: 0,
        staleTokensCleaned: 0,
      });
      return;
    }

    const usersSnapshot = await db
      .collection('users')
      .where('fcmToken', '!=', null)
      .get();

    if (usersSnapshot.empty) {
      logger.info('No users with FCM tokens, skipping reminder', { dateKey: todayKey });
      await logRef.set({
        dateKey: todayKey,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        skippedReason: 'no_tokens',
        targetedCount: 0,
        successCount: 0,
        failureCount: 0,
        staleTokensCleaned: 0,
      });
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
      logger.info('All users with tokens have already completed today', { dateKey: todayKey });
      await logRef.set({
        dateKey: todayKey,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        skippedReason: 'all_completed',
        targetedCount: 0,
        successCount: 0,
        failureCount: 0,
        staleTokensCleaned: 0,
      });
      return;
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      data: {
        title: 'של״ז בכושר 💪',
        body: 'לא לשכוח את האימון היומי! נשארו עוד שעתיים.',
        link: '/home',
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    logger.info('Daily reminder sent', {
      dateKey: todayKey,
      targetedCount: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

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
      logger.info('Cleaned up stale FCM tokens', {
        dateKey: todayKey,
        count: staleTokenCleanups.length,
      });
    }

    await logRef.set({
      dateKey: todayKey,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      targetedCount: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      staleTokensCleaned: staleTokenCleanups.length,
    });
  }
);
