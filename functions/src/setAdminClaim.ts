import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { defineString } from 'firebase-functions/params';
import { admin, db } from './firebase';

const bootstrapEmail = defineString('BOOTSTRAP_ADMIN_EMAIL', { default: '' });

export const setAdminClaim = onCall(async (request) => {
  const { targetUid } = request.data;

  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'targetUid is required');
  }

  const isCallerAdmin = request.auth?.token?.admin === true;
  const isBootstrap =
    bootstrapEmail.value() &&
    request.auth?.token?.email === bootstrapEmail.value();

  if (!isCallerAdmin && !isBootstrap) {
    throw new HttpsError('permission-denied', 'Only admins can set admin claims');
  }

  await admin.auth().setCustomUserClaims(targetUid, { admin: true });

  await db.collection('users').doc(targetUid).update({
    role: 'admin',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info('Admin claim granted', {
    targetUid,
    grantedBy: request.auth?.uid,
    via: isBootstrap ? 'bootstrap' : 'admin',
  });

  return { success: true };
});
