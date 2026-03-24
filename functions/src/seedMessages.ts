import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin, db } from './firebase';

const SEED_MESSAGES = [
  'אתה יכול הכל! תאמין בעצמך 💪',
  'כל אימון מקרב אותך למטרה!',
  'גם 10 דקות עושות את ההבדל!',
  'הגוף שלך יודה לך אחר כך!',
  'אלוף! עוד יום של התמדה!',
  'קדימה, בוא נעשה את זה ביחד!',
  'הדרך להצלחה מתחילה בצעד אחד קטן!',
  'אל תוותר! אתה כבר כאן!',
  'כל יום שאתה מתאמן, אתה נהיה חזק יותר!',
  'תזכור למה התחלת 🔥',
  'אין דבר כזה "אני לא יכול"!',
  'היום זה היום שלך!',
  'בוא נשבור שיאים!',
  'תראה כמה אתה מדהים!',
  'עוד אימון אחד קרוב יותר לגרסה הכי טובה שלך!',
];

export const seedMotivationalMessages = onCall(async (request) => {
  if (!request.auth?.token?.admin) {
    throw new HttpsError('permission-denied', 'Admin only');
  }

  const existing = await db.collection('motivationalMessages').limit(1).get();
  if (!existing.empty) {
    return { message: 'Messages already seeded', count: 0 };
  }

  const batch = db.batch();
  SEED_MESSAGES.forEach((text) => {
    const ref = db.collection('motivationalMessages').doc();
    batch.set(ref, {
      text,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  return { message: 'Seeded successfully', count: SEED_MESSAGES.length };
});
