import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { FieldValue } from 'firebase-admin/firestore';
import { admin, db } from './firebase';
import { getTodayDateKeyIST } from './shared/dates';

type Audience = 'all' | 'not_completed_today' | 'completed_today';

export const sendCustomPush = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError('permission-denied', 'Only admins can send push notifications');
  }

  const { title, body, audience } = request.data as {
    title: string;
    body: string;
    audience: Audience;
  };

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new HttpsError('invalid-argument', 'title is required');
  }
  if (!body || typeof body !== 'string' || !body.trim()) {
    throw new HttpsError('invalid-argument', 'body is required');
  }
  if (!['all', 'not_completed_today', 'completed_today'].includes(audience)) {
    throw new HttpsError('invalid-argument', 'audience must be all, not_completed_today, or completed_today');
  }

  const usersSnapshot = await db
    .collection('users')
    .where('fcmToken', '!=', null)
    .get();

  if (usersSnapshot.empty) {
    logger.info('No users with FCM tokens');
    return { sentCount: 0, failureCount: 0 };
  }

  const userTokens: Array<{ uid: string; token: string }> = [];

  if (audience === 'all') {
    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.fcmToken) userTokens.push({ uid: doc.id, token: data.fcmToken });
    });
  } else {
    const todayKey = getTodayDateKeyIST();
    const completionsSnapshot = await db
      .collection('workoutCompletions')
      .where('dateKey', '==', todayKey)
      .where('completed', '==', true)
      .get();
    const completedUids = new Set(completionsSnapshot.docs.map((d) => d.data().uid as string));

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (!data.fcmToken) return;
      const isCompleted = completedUids.has(doc.id);
      if (audience === 'not_completed_today' && !isCompleted) {
        userTokens.push({ uid: doc.id, token: data.fcmToken });
      } else if (audience === 'completed_today' && isCompleted) {
        userTokens.push({ uid: doc.id, token: data.fcmToken });
      }
    });
  }

  if (userTokens.length === 0) {
    logger.info('No matching tokens for audience', { audience });
    await db.collection('notificationLogs').add({
      type: 'manual',
      title: title.trim(),
      body: body.trim(),
      audience,
      sentAt: FieldValue.serverTimestamp(),
      sentBy: request.auth.uid,
      targetedCount: 0,
      successCount: 0,
      failureCount: 0,
      staleTokensCleaned: 0,
    });
    return { sentCount: 0, failureCount: 0 };
  }

  const tokens = userTokens.map((u) => u.token);
  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title: title.trim(), body: body.trim() },
    webpush: { fcmOptions: { link: '/home' } },
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  logger.info('Custom push sent', {
    audience,
    targetedCount: tokens.length,
    successCount: response.successCount,
    failureCount: response.failureCount,
    sentBy: request.auth.uid,
  });

  // Remove permanently-invalid tokens
  const staleCleanups: Promise<void>[] = [];
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
          staleCleanups.push(
            userDoc.ref
              .update({
                fcmToken: FieldValue.delete(),
                updatedAt: FieldValue.serverTimestamp(),
              })
              .then(() => undefined)
          );
        }
      }
    }
  });

  if (staleCleanups.length > 0) {
    await Promise.all(staleCleanups);
  }

  await db.collection('notificationLogs').add({
    type: 'manual',
    title: title.trim(),
    body: body.trim(),
    audience,
    sentAt: FieldValue.serverTimestamp(),
    sentBy: request.auth.uid,
    targetedCount: tokens.length,
    successCount: response.successCount,
    failureCount: response.failureCount,
    staleTokensCleaned: staleCleanups.length,
  });

  return {
    sentCount: response.successCount,
    failureCount: response.failureCount,
  };
});
