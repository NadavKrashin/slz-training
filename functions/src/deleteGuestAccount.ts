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
  const userRecord = await admin.auth().getUser(uid);

  if (userRecord.providerData.length > 0) {
    throw new HttpsError('failed-precondition', 'Cannot delete a non-guest account');
  }

  await db.collection('users').doc(uid).delete();
  await admin.auth().deleteUser(uid);

  logger.info('Guest account deleted', { uid });
  return { success: true };
});
