/**
 * Seed script for Firebase emulators.
 *
 * Run with: npm run seed
 * Requires: Firebase emulators running (npm run emulators)
 *
 * Populates:
 * - Admin user + regular user
 * - 14 days of workouts (today + 13 future days)
 * - Sample completions for the past 7 days
 * - App settings with sportDayDueDate
 * - Motivational messages
 */

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

import * as admin from 'firebase-admin';

admin.initializeApp({ projectId: 'demo-slz-training' });
const db = admin.firestore();
const auth = admin.auth();

// --- Workout Templates (subset for seeding) ---

interface Stage {
  id: string;
  name: string;
  type: 'exercise' | 'rest';
  durationSeconds: number;
  order: number;
}

function s(id: string, name: string, type: 'exercise' | 'rest', dur: number, order: number): Stage {
  return { id, name, type, durationSeconds: dur, order };
}

const WORKOUTS = [
  {
    title: 'חימום בוקר',
    description: 'אימון קל לפתיחת היום',
    stages: [
      s('s1', 'ריצה במקום', 'exercise', 60, 1), s('s2', 'מנוחה', 'rest', 30, 2),
      s('s3', 'מתיחת גב', 'exercise', 60, 3), s('s4', 'מנוחה', 'rest', 30, 4),
      s('s5', 'סקוואט', 'exercise', 60, 5), s('s6', 'מנוחה', 'rest', 30, 6),
      s('s7', 'מתיחת ירכיים', 'exercise', 60, 7), s('s8', 'מנוחה', 'rest', 30, 8),
      s('s9', 'קפיצות', 'exercise', 60, 9), s('s10', 'מתיחה סופית', 'exercise', 120, 10),
      s('s11', 'מנוחה', 'rest', 60, 11),
    ],
  },
  {
    title: 'קארדיו שריפה',
    description: 'אימון אירובי אינטנסיבי',
    stages: [
      s('s1', 'ג׳אמפינג ג׳ק', 'exercise', 60, 1), s('s2', 'מנוחה', 'rest', 20, 2),
      s('s3', 'ברפי', 'exercise', 50, 3), s('s4', 'מנוחה', 'rest', 20, 4),
      s('s5', 'ריצה במקום', 'exercise', 60, 5), s('s6', 'מנוחה', 'rest', 20, 6),
      s('s7', 'סקוואט ג׳אמפ', 'exercise', 50, 7), s('s8', 'מנוחה', 'rest', 20, 8),
      s('s9', 'מטפסי הרים', 'exercise', 60, 9), s('s10', 'מנוחה', 'rest', 20, 10),
      s('s11', 'קפיצות צלב', 'exercise', 60, 11), s('s12', 'מתיחה', 'rest', 60, 12),
      s('s13', 'ריצה', 'exercise', 60, 13), s('s14', 'מנוחה', 'rest', 40, 14),
    ],
  },
  {
    title: 'ליבה פלדה',
    description: 'חיזוק בטן וגב',
    stages: [
      s('s1', 'פלאנק', 'exercise', 50, 1), s('s2', 'מנוחה', 'rest', 15, 2),
      s('s3', 'כפיפות בטן', 'exercise', 60, 3), s('s4', 'מנוחה', 'rest', 20, 4),
      s('s5', 'פלאנק צד ימין', 'exercise', 45, 5), s('s6', 'מנוחה', 'rest', 15, 6),
      s('s7', 'פלאנק צד שמאל', 'exercise', 45, 7), s('s8', 'מנוחה', 'rest', 15, 8),
      s('s9', 'אופניים', 'exercise', 60, 9), s('s10', 'מנוחה', 'rest', 20, 10),
      s('s11', 'סופרמן', 'exercise', 50, 11), s('s12', 'מנוחה', 'rest', 15, 12),
      s('s13', 'הרמת רגליים', 'exercise', 50, 13), s('s14', 'מנוחה', 'rest', 15, 14),
      s('s15', 'פלאנק', 'exercise', 50, 15), s('s16', 'מתיחה', 'rest', 75, 16),
    ],
  },
  {
    title: 'כוח מלא',
    description: 'אימון גוף מלא',
    stages: [
      s('s1', 'סקוואט', 'exercise', 50, 1), s('s2', 'מנוחה', 'rest', 15, 2),
      s('s3', 'שכיבות סמיכה', 'exercise', 50, 3), s('s4', 'מנוחה', 'rest', 15, 4),
      s('s5', 'לאנג׳', 'exercise', 50, 5), s('s6', 'מנוחה', 'rest', 15, 6),
      s('s7', 'פלאנק', 'exercise', 50, 7), s('s8', 'מנוחה', 'rest', 15, 8),
      s('s9', 'ברפי', 'exercise', 45, 9), s('s10', 'מנוחה', 'rest', 20, 10),
      s('s11', 'גשר ישבן', 'exercise', 50, 11), s('s12', 'מנוחה', 'rest', 15, 12),
      s('s13', 'מטפסי הרים', 'exercise', 45, 13), s('s14', 'מנוחה', 'rest', 15, 14),
      s('s15', 'כפיפות בטן', 'exercise', 50, 15), s('s16', 'מתיחה', 'rest', 55, 16),
    ],
  },
] as const;

// Validate totals
WORKOUTS.forEach((w) => {
  const total = w.stages.reduce((sum, s) => sum + s.durationSeconds, 0);
  if (total !== 600) throw new Error(`Workout "${w.title}" totals ${total}s, not 600`);
});

function getDateKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
}

async function seed() {
  console.log('Seeding Firebase emulators...\n');

  // 1. Create users
  const adminUser = await auth.createUser({
    uid: 'admin-user-1',
    email: 'admin@test.com',
    password: 'admin123',
    displayName: 'מנהל מערכת',
  });
  await auth.setCustomUserClaims(adminUser.uid, { admin: true });

  const regularUser = await auth.createUser({
    uid: 'user-1',
    email: 'user@test.com',
    password: 'user1234',
    displayName: 'משתמש לדוגמה',
  });

  console.log('  Users created:');
  console.log(`    Admin:   admin@test.com / admin123`);
  console.log(`    Regular: user@test.com / user1234\n`);

  // 2. Create user profiles in Firestore
  const batch1 = db.batch();
  batch1.set(db.doc(`users/${adminUser.uid}`), {
    uid: adminUser.uid, email: 'admin@test.com', displayName: 'מנהל מערכת',
    role: 'admin', shareCompletionWithAdmin: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  batch1.set(db.doc(`users/${regularUser.uid}`), {
    uid: regularUser.uid, email: 'user@test.com', displayName: 'משתמש לדוגמה',
    role: 'user', shareCompletionWithAdmin: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await batch1.commit();
  console.log('  User profiles created in Firestore');

  // 3. Create workouts — 7 past + today + 6 future = 14 days
  const batch2 = db.batch();
  for (let i = -7; i <= 6; i++) {
    const dateKey = getDateKey(i);
    const workout = WORKOUTS[(i + 7) % WORKOUTS.length];
    batch2.set(db.doc(`workoutsByDate/${dateKey}`), {
      dateKey,
      title: workout.title,
      description: workout.description,
      stages: [...workout.stages],
      totalDurationSeconds: 600,
      createdBy: adminUser.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch2.commit();
  console.log('  14 workouts created (7 past + today + 6 future)');

  // 4. Create completions for past 5 days (regular user)
  const batch3 = db.batch();
  for (let i = -5; i <= -1; i++) {
    const dateKey = getDateKey(i);
    const docId = `${regularUser.uid}_${dateKey}`;
    batch3.set(db.doc(`workoutCompletions/${docId}`), {
      uid: regularUser.uid,
      dateKey,
      completed: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      workoutTitle: WORKOUTS[(i + 7) % WORKOUTS.length].title,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch3.commit();
  console.log('  5 completions created (5-day streak for regular user)');

  // 5. App settings
  const sportDayDate = new Date();
  sportDayDate.setDate(sportDayDate.getDate() + 30);
  await db.doc('appSettings/general').set({
    timezone: 'Asia/Jerusalem',
    sportDayDueDate: admin.firestore.Timestamp.fromDate(sportDayDate),
  });
  console.log('  App settings created (sport day in 30 days)');

  // 6. Motivational messages
  const messages = [
    'אתה יכול הכל! תאמין בעצמך 💪',
    'כל אימון מקרב אותך למטרה!',
    'גם 10 דקות עושות את ההבדל!',
    'הגוף שלך יודה לך אחר כך!',
    'אלוף! עוד יום של התמדה!',
  ];
  const batch4 = db.batch();
  messages.forEach((text, i) => {
    batch4.set(db.collection('motivationalMessages').doc(`msg-${i}`), {
      text, active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch4.commit();
  console.log('  5 motivational messages created');

  console.log('\nSeed complete! You can now:\n');
  console.log('  1. Run: npm run dev');
  console.log('  2. Login as admin@test.com / admin123');
  console.log('  3. Or login as user@test.com / user1234');
  console.log('  4. Open Dev Toolbar with Ctrl+Shift+D');
  console.log('  5. Set timer speed to 60x to test workout in ~10 seconds');
  console.log('  6. View emulator UI at http://localhost:4000\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
