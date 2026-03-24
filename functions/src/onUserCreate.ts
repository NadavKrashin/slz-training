import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { admin } from './firebase';

export const onUserCreate = onDocumentCreated('users/{uid}', async (event) => {
  const data = event.data?.data();
  if (!data || data.role) return;

  await event.data?.ref.set(
    {
      shareCompletionWithAdmin: false,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
});