'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompletionsForUser } from '@/lib/firebase/firestore';
import type { WorkoutCompletion } from '@/lib/types';

const completionsCache = new Map<string, Map<string, WorkoutCompletion>>();

export function useCompletions(startDate: string, endDate: string) {
  const { user } = useAuth();
  const cacheKey = `${user?.uid ?? ''}:${startDate}:${endDate}`;
  const cached = completionsCache.get(cacheKey);

  const [completions, setCompletions] = useState<Map<string, WorkoutCompletion>>(cached ?? new Map());
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (!user) {
      setCompletions(new Map());
      setLoading(false);
      return;
    }
    getCompletionsForUser(user.uid, startDate, endDate).then((data) => {
      const map = new Map<string, WorkoutCompletion>();
      data.forEach((c) => map.set(c.dateKey, c));
      completionsCache.set(cacheKey, map);
      setCompletions(map);
      setLoading(false);
    });
  }, [user, startDate, endDate, cacheKey]);

  return { completions, loading };
}

export function useCompletionsForUid(uid: string, startDate: string, endDate: string) {
  const [completions, setCompletions] = useState<Map<string, WorkoutCompletion>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setCompletions(new Map());
      setLoading(false);
      return;
    }
    setLoading(true);
    getCompletionsForUser(uid, startDate, endDate).then((data) => {
      const map = new Map<string, WorkoutCompletion>();
      data.forEach((c) => map.set(c.dateKey, c));
      setCompletions(map);
      setLoading(false);
    });
  }, [uid, startDate, endDate]);

  return { completions, loading };
}
