import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './config';
import { updateUser } from './firestore';

let messaging: ReturnType<typeof getMessaging> | null = null;

function getMessagingInstance() {
  if (typeof window === 'undefined') return null;
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}

export async function requestNotificationPermission(uid: string): Promise<boolean> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;
    const msg = getMessagingInstance();
    if (!msg) return false;
    const token = await getToken(msg, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
    if (!token) return false;
    await updateUser(uid, { fcmToken: token });
    return true;
  } catch {
    return false;
  }
}

/**
 * Call once on app mount for authenticated users who have previously granted
 * notification permission. Firebase silently rotates tokens — this ensures
 * Firestore always has the current token.
 */
export async function syncFcmToken(uid: string): Promise<void> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  try {
    const msg = getMessagingInstance();
    if (!msg) return;
    const token = await getToken(msg, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
    if (token) await updateUser(uid, { fcmToken: token });
  } catch {
    /* silently ignore — not critical */
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  const msg = getMessagingInstance();
  if (!msg) return () => {};
  return onMessage(msg, callback);
}
