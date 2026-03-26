'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  signIn,
  signUp,
  signInWithGoogle,
  signInAsGuest,
  linkGuestToEmail,
  linkGuestToGoogle,
  resetPassword,
  signOut,
  updateDisplayName,
} from '@/lib/firebase/auth';
import { requestNotificationPermission, syncFcmToken } from '@/lib/firebase/messaging';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  linkGuestToEmail: (email: string, password: string, displayName: string) => Promise<void>;
  linkGuestToGoogle: () => Promise<void>;
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
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const isAnon = firebaseUser.isAnonymous;
        setIsGuest(isAnon);
        // Resolve admin claims and notifications async — never block the loading state
        firebaseUser.getIdTokenResult().then((tokenResult) => {
          setIsAdmin(tokenResult.claims.admin === true);
        });
        if (!isAnon && typeof window !== 'undefined' && typeof Notification !== 'undefined') {
          if (Notification.permission === 'default') {
            requestNotificationPermission(firebaseUser.uid);
          } else {
            syncFcmToken(firebaseUser.uid);
          }
        }
      } else {
        setIsAdmin(false);
        setIsGuest(false);
      }
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
    user,
    loading,
    isAdmin,
    isGuest,
    signIn: async (email, password) => {
      await signIn(email, password);
    },
    signUp: async (email, password, displayName) => {
      await signUp(email, password, displayName);
    },
    signInWithGoogle: async () => {
      await signInWithGoogle();
    },
    signInAsGuest: async () => {
      await signInAsGuest();
    },
    linkGuestToEmail: async (email, password, displayName) => {
      await linkGuestToEmail(email, password, displayName);
    },
    linkGuestToGoogle: async () => {
      await linkGuestToGoogle();
    },
    resetPassword: async (email) => {
      await resetPassword(email);
    },
    signOut: async () => {
      await signOut();
    },
    updateDisplayName: async (name) => {
      await updateDisplayName(name);
    },
    refreshClaims,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
