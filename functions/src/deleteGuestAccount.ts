import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { admin, db } from './firebase';

/**
 * Deletes the calling user's own guest account (Auth + Firestore).
 * Only works if the caller is a truly anonymous user (no linked providers).
 */
export const deleteGuestAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Not authenticated');
  }

  const uid = request.auth.uid;

  try {
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.providerData.length > 0) {
      throw new HttpsError('failed-precondition', 'Cannot delete a non-guest account');
    }
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    // User record not found or already deleted — proceed with cleanup
    logger.warn('getUser failed during guest deletion, proceeding', { uid, err });
  }

  try {
    await db.collection('users').doc(uid).delete();
  } catch (err) {
    logger.warn('Failed to delete Firestore user doc', { uid, err });
  }

  try {
    await admin.auth().deleteUser(uid);
  } catch (err) {
    logger.warn('Failed to delete Auth user', { uid, err });
  }

  logger.info('Guest account deleted', { uid });
  return { success: true };
});
