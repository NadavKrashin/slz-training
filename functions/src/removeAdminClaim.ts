import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { FieldValue } from 'firebase-admin/firestore';
import { admin, db } from './firebase';

export const removeAdminClaim = onCall(async (request) => {
  const { targetUid } = request.data;

  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'targetUid is required');
  }

  if (request.auth?.token?.admin !== true) {
    throw new HttpsError('permission-denied', 'Only admins can remove admin claims');
  }

  if (request.auth?.uid === targetUid) {
    throw new HttpsError('failed-precondition', 'Cannot remove your own admin claim');
  }

  await admin.auth().setCustomUserClaims(targetUid, { admin: false });

  await db.collection('users').doc(targetUid).update({
    role: 'user',
    updatedAt: FieldValue.serverTimestamp(),
  });

  logger.info('Admin claim removed', {
    targetUid,
    removedBy: request.auth?.uid,
  });

  return { success: true };
});
