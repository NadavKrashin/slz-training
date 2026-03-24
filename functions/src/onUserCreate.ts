import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { admin, db } from './firebase';

export const onUserCreate = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) return;

  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || '',
    shareCompletionWithAdmin: false,
    role: 'user',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
