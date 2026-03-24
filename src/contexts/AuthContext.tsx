'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { signIn, signUp, signInWithGoogle, resetPassword, signOut, updateDisplayName } from '@/lib/firebase/auth';
import { requestNotificationPermission, syncFcmToken } from '@/lib/firebase/messaging';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
        // Request permission on first login; sync token if already granted
        if (typeof window !== 'undefined') {
          if (Notification.permission === 'default') {
            requestNotificationPermission(firebaseUser.uid);
          } else {
            syncFcmToken(firebaseUser.uid);
          }
        }
      } else { setIsAdmin(false); }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshClaims = async () => {
    if (auth.currentUser) {
      const tokenResult = await auth.currentUser.getIdTokenResult(true);
      setIsAdmin(tokenResult.claims.admin === true);
    }
  };

  const value: AuthContextValue = {
    user, loading, isAdmin,
    signIn: async (email, password) => { await signIn(email, password); },
    signUp: async (email, password, displayName) => { await signUp(email, password, displayName); },
    signInWithGoogle: async () => { await signInWithGoogle(); },
    resetPassword: async (email) => { await resetPassword(email); },
    signOut: async () => { await signOut(); },
    updateDisplayName: async (name) => { await updateDisplayName(name); },
    refreshClaims,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
