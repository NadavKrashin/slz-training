'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUser, updateUser } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/lib/types';

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }
    const unsub = subscribeToUser(user.uid, (data) => {
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
