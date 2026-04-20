import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { admin, db } from './firebase';

/**
 * Daily cleanup of guest Firestore profiles whose Firebase Auth account
 * no longer exists (covers sessions that ended without an explicit sign-out).
 */
export const cleanupGuests = onSchedule(
  { schedule: '0 3 * * *', timeZone: 'Asia/Jerusalem' },
  async () => {
    const snapshot = await db.collection('users').where('role', '==', 'guest').get();

    if (snapshot.empty) {
      logger.info('No guest profiles found, skipping cleanup');
      return;
    }

    let deleted = 0;
    await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        try {
          await admin.auth().getUser(docSnap.id);
          // Auth account still exists — leave it alone
        } catch (err: any) {
          if (err.code === 'auth/user-not-found') {
            await docSnap.ref.delete();
            deleted++;
          }
        }
      })
    );

    logger.info(`Guest cleanup complete`, { total: snapshot.size, deleted });
  }
);
