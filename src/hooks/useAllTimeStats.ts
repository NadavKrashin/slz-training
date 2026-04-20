'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkoutCount, getCompletionCountForUser } from '@/lib/firebase/firestore';
import { getTodayDateKey } from '@/lib/dates';

interface AllTimeStatsCache {
  totalCompleted: number;
  totalPosted: number;
}

const allTimeStatsCache = new Map<string, AllTimeStatsCache>();

export function useAllTimeStats() {
  const { user } = useAuth();
  const today = getTodayDateKey();
  const cacheKey = `${user?.uid ?? ''}:${today}`;
  const cached = allTimeStatsCache.get(cacheKey);

  const [totalCompleted, setTotalCompleted] = useState(cached?.totalCompleted ?? 0);
  const [totalPosted, setTotalPosted] = useState(cached?.totalPosted ?? 0);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (!user) {
      setTotalCompleted(0);
      setTotalPosted(0);
      setLoading(false);
      return;
    }

    async function calculate() {
      try {
        const [completedCount, workoutCount] = await Promise.all([
          getCompletionCountForUser(user!.uid, today),
          getWorkoutCount(today),
        ]);
        allTimeStatsCache.set(cacheKey, { totalCompleted: completedCount, totalPosted: workoutCount });
        setTotalCompleted(completedCount);
        setTotalPosted(workoutCount);
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [user, today, cacheKey]);

  return { totalCompleted, totalPosted, loading };
}
