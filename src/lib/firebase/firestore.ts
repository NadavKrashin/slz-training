import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type {
  UserProfile,
  Workout,
  WorkoutCompletion,
  AppSettings,
  MotivationalMessage,
} from '../types';

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    displayName,
    role: 'user',
    shareCompletionWithAdmin: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createGuestProfile(uid: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    uid,
    email: '',
    displayName: 'אורח',
    role: 'guest',
    shareCompletionWithAdmin: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function upsertUserProfile(
  uid: string,
  data: { email: string; displayName: string; photoURL?: string }
): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const existingRole = snap.exists() ? (snap.data().role ?? 'user') : 'user';
  // Upgrade guest to user when linking account
  const role = existingRole === 'guest' ? 'user' : existingRole;
  await setDoc(
    ref,
    {
      uid,
      ...data,
      role,
      shareCompletionWithAdmin: snap.data()?.shareCompletionWithAdmin ?? false,
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

export function subscribeToUser(
  uid: string,
  callback: (user: UserProfile | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      callback(snap.exists() ? ({ ...snap.data(), uid: snap.id } as UserProfile) : null);
    },
    (error) => {
      console.error('[subscribeToUser]', error);
      callback(null);
    }
  );
}

export async function updateUser(uid: string, data: Partial<UserProfile>) {
  return updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }) as UserProfile);
}

export function subscribeToWorkout(
  dateKey: string,
  callback: (workout: Workout | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'workoutsByDate', dateKey),
    (snap) => {
      callback(snap.exists() ? (snap.data() as Workout) : null);
    },
    (error) => {
      console.error('[subscribeToWorkout]', error);
      callback(null);
    }
  );
}

export async function getWorkout(dateKey: string): Promise<Workout | null> {
  const snap = await getDoc(doc(db, 'workoutsByDate', dateKey));
  return snap.exists() ? (snap.data() as Workout) : null;
}

export async function saveWorkout(
  dateKey: string,
  workout: Omit<Workout, 'createdAt' | 'updatedAt'>
) {
  const existing = await getDoc(doc(db, 'workoutsByDate', dateKey));
  if (existing.exists()) {
    return updateDoc(doc(db, 'workoutsByDate', dateKey), {
      ...workout,
      updatedAt: serverTimestamp(),
    });
  }
  return setDoc(doc(db, 'workoutsByDate', dateKey), {
    ...workout,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkout(dateKey: string) {
  return deleteDoc(doc(db, 'workoutsByDate', dateKey));
}

export async function getWorkoutsInRange(start: string, end: string): Promise<Workout[]> {
  const q = query(
    collection(db, 'workoutsByDate'),
    where('dateKey', '>=', start),
    where('dateKey', '<=', end),
    orderBy('dateKey', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Workout);
}

function completionDocId(uid: string, dateKey: string) {
  return `${uid}_${dateKey}`;
}

export function subscribeToCompletion(
  uid: string,
  dateKey: string,
  callback: (completion: WorkoutCompletion | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'workoutCompletions', completionDocId(uid, dateKey)),
    (snap) => {
      callback(snap.exists() ? (snap.data() as WorkoutCompletion) : null);
    },
    (error) => {
      console.error('[subscribeToCompletion]', error);
      callback(null);
    }
  );
}

export async function markWorkoutComplete(uid: string, dateKey: string, workoutTitle: string) {
  const docId = completionDocId(uid, dateKey);
  const existing = await getDoc(doc(db, 'workoutCompletions', docId));
  if (existing.exists()) {
    return updateDoc(doc(db, 'workoutCompletions', docId), {
      completed: true,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return setDoc(doc(db, 'workoutCompletions', docId), {
    uid,
    dateKey,
    completed: true,
    completedAt: serverTimestamp(),
    workoutTitle,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getCompletionsForUser(
  uid: string,
  start: string,
  end: string
): Promise<WorkoutCompletion[]> {
  const q = query(
    collection(db, 'workoutCompletions'),
    where('uid', '==', uid),
    where('dateKey', '>=', start),
    where('dateKey', '<=', end)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WorkoutCompletion);
}

export async function getAllWorkoutsUpTo(end: string): Promise<Workout[]> {
  const q = query(
    collection(db, 'workoutsByDate'),
    where('dateKey', '<=', end),
    orderBy('dateKey', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Workout);
}

export async function getAllCompletionsForUser(uid: string, end: string): Promise<WorkoutCompletion[]> {
  const q = query(
    collection(db, 'workoutCompletions'),
    where('uid', '==', uid),
    where('dateKey', '<=', end)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WorkoutCompletion);
}

export async function getCompletionsForDate(dateKey: string): Promise<WorkoutCompletion[]> {
  const q = query(
    collection(db, 'workoutCompletions'),
    where('dateKey', '==', dateKey),
    where('completed', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WorkoutCompletion);
}

export function subscribeToAppSettings(
  callback: (settings: AppSettings | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'appSettings', 'general'),
    (snap) => {
      callback(snap.exists() ? (snap.data() as AppSettings) : null);
    },
    (error) => {
      console.error('[subscribeToAppSettings]', error);
      callback(null);
    }
  );
}

export async function updateAppSettings(data: Partial<AppSettings>) {
  return setDoc(doc(db, 'appSettings', 'general'), data, { merge: true });
}

export async function getActiveMessages(): Promise<MotivationalMessage[]> {
  const q = query(collection(db, 'motivationalMessages'), where('active', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as MotivationalMessage);
}

export async function getAllMessages(): Promise<MotivationalMessage[]> {
  const snap = await getDocs(collection(db, 'motivationalMessages'));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as MotivationalMessage);
}

export async function saveMessage(id: string | null, text: string, active: boolean) {
  if (id) {
    return updateDoc(doc(db, 'motivationalMessages', id), {
      text,
      active,
      updatedAt: serverTimestamp(),
    });
  }
  const ref = doc(collection(db, 'motivationalMessages'));
  return setDoc(ref, { text, active, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function deleteMessage(id: string) {
  return deleteDoc(doc(db, 'motivationalMessages', id));
}
