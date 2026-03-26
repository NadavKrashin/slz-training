/**
 * Centralised browser capability checks.
 *
 * Every check is safe to call at module scope, in useState initialisers,
 * and inside onAuthStateChanged — they never throw.
 */

/** True when running in a browser (not SSR / Node). */
export const isBrowser = typeof window !== 'undefined';

/** True when the Notification API is available (false on iOS Safari < 16.4, etc.). */
export const hasNotificationAPI = isBrowser && typeof Notification !== 'undefined';

/** Current notification permission, safe on any platform. */
export function getNotificationPermission(): NotificationPermission {
  return hasNotificationAPI ? Notification.permission : 'default';
}
