/**
 * Seed test users into the deployed dev Firebase project (slz-training-dev).
 *
 * Prerequisites:
 *   gcloud auth application-default login
 *   (or set GOOGLE_APPLICATION_CREDENTIALS to a service account key file)
 *
 * Run with:
 *   npm run seed:dev
 *
 * Creates:
 *   - 1 admin user  (admin@test.com / Admin1234!)
 *   - 5 regular users (user1@test.com … user5@test.com / User1234!)
 *   - Corresponding Firestore user profiles
 *
 * Idempotent: skips users that already exist in Auth or Firestore.
 */

import * as admin from 'firebase-admin';

admin.initializeApp({ projectId: 'slz-training-dev' });
const db = admin.firestore();
const auth = admin.auth();

interface SeedUser {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'user';
}

const USERS: SeedUser[] = [
  { email: 'admin@test.com',  password: 'Admin1234!', displayName: 'מנהל מערכת', role: 'admin' },
  { email: 'user1@test.com',  password: 'User1234!',  displayName: 'דני לוי',      role: 'user' },
  { email: 'user2@test.com',  password: 'User1234!',  displayName: 'יעל כהן',      role: 'user' },
  { email: 'user3@test.com',  password: 'User1234!',  displayName: 'אבי מזרחי',    role: 'user' },
  { email: 'user4@test.com',  password: 'User1234!',  displayName: 'רונית שמעון',  role: 'user' },
  { email: 'user5@test.com',  password: 'User1234!',  displayName: 'מיכל פרץ',     role: 'user' },
];

async function seedUsers() {
  console.log('Seeding users into slz-training-dev...\n');

  for (const u of USERS) {
    // Create or fetch Auth user
    let uid: string;
    try {
      const existing = await auth.getUserByEmail(u.email);
      uid = existing.uid;
      console.log(`  [skip] ${u.email} already exists in Auth (uid: ${uid})`);
    } catch {
      const created = await auth.createUser({
        email: u.email,
        password: u.password,
        displayName: u.displayName,
      });
      uid = created.uid;
      console.log(`  [created] ${u.email} (uid: ${uid})`);
    }

    // Set admin custom claim
    if (u.role === 'admin') {
      await auth.setCustomUserClaims(uid, { admin: true });
    }

    // Create Firestore profile (skip if already exists)
    const ref = db.doc(`users/${uid}`);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  [skip] Firestore profile for ${u.email} already exists`);
    } else {
      await ref.set({
        uid,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        shareCompletionWithAdmin: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  [created] Firestore profile for ${u.email}`);
    }
  }

  console.log('\nDone! Credentials:\n');
  console.log('  Admin:   admin@test.com  / Admin1234!');
  console.log('  Users:   user1–5@test.com / User1234!\n');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Seed failed:', err.message ?? err);
  process.exit(1);
});
