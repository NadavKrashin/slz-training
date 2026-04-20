import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import app from './config';

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

const functions = getFunctions(app);

if (typeof window !== 'undefined' && useEmulators) {
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch {
    // Already connected (hot reload)
  }
}

export const setAdminClaimFn = httpsCallable<{ targetUid: string }, { success: boolean }>(
  functions,
  'setAdminClaim'
);

export const removeAdminClaimFn = httpsCallable<{ targetUid: string }, { success: boolean }>(
  functions,
  'removeAdminClaim'
);

export const deleteGuestAccountFn = httpsCallable<Record<string, never>, { success: boolean }>(
  functions,
  'deleteGuestAccount'
);

export const sendCustomPushFn = httpsCallable<
  { title: string; body: string; audience: 'all' | 'not_completed_today' | 'completed_today' },
  { sentCount: number; failureCount: number }
>(functions, 'sendCustomPush');
