'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUser, updateUser } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/lib/types';

// Module-level cache — persists across page navigations within a session.
let _cachedUid: string | null = null;
let _cachedData: UserProfile | null = null;

export function useUser() {
  const { user } = useAuth();

  const initialData = user?.uid === _cachedUid ? _cachedData : null;
  const [userData, setUserData] = useState<UserProfile | null>(initialData);
  const [loading, setLoading] = useState(initialData === null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }
    const unsub = subscribeToUser(user.uid, (data) => {
      _cachedUid = user.uid;
      _cachedData = data;
      setUserData(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateUser(user.uid, data);
  };

  return { userData, loading, updateProfile };
}
