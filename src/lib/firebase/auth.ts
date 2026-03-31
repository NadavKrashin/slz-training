import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { deleteGuestAccountFn } from './functions';
import { createUserProfile, createGuestProfile, upsertUserProfile } from './firestore';

const googleProvider = new GoogleAuthProvider();

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user.uid, email, displayName);
  return cred;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const { uid, email, displayName, photoURL } = cred.user;
  await upsertUserProfile(uid, {
    email: email ?? '',
    displayName: displayName ?? '',
    photoURL: photoURL ?? '',
  });
  return cred;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  const user = auth.currentUser;
  if (user?.isAnonymous) {
    await deleteGuestAccountFn({});
    // Auth account is deleted server-side; sign out the client session
    return firebaseSignOut(auth);
  }
  return firebaseSignOut(auth);
}

export async function updateDisplayName(displayName: string) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  return updateProfile(auth.currentUser, { displayName });
}

export async function signInAsGuest() {
  const cred = await firebaseSignInAnonymously(auth);
  await createGuestProfile(cred.user.uid);
  return cred;
}

export async function linkGuestToEmail(email: string, password: string, displayName: string) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(email, password);
  const result = await linkWithCredential(auth.currentUser, credential);
  await updateProfile(result.user, { displayName });
  await upsertUserProfile(result.user.uid, { email, displayName });
  return result;
}

export async function linkGuestToGoogle() {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const result = await linkWithPopup(auth.currentUser, googleProvider);
  const { uid, email, displayName, photoURL } = result.user;
  await upsertUserProfile(uid, {
    email: email ?? '',
    displayName: displayName ?? '',
    photoURL: photoURL ?? '',
  });
  return result;
}
