'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkoutCount, getCompletionCountForUser } from '@/lib/firebase/firestore';
import { getTodayDateKey } from '@/lib/dates';

export function useAllTimeStats() {
  const { user } = useAuth();
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPosted, setTotalPosted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTotalCompleted(0);
      setTotalPosted(0);
      setLoading(false);
      return;
    }

    async function calculate() {
      try {
        const today = getTodayDateKey();
        const [completedCount, workoutCount] = await Promise.all([
          getCompletionCountForUser(user!.uid, today),
          getWorkoutCount(today),
        ]);
        setTotalCompleted(completedCount);
        setTotalPosted(workoutCount);
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [user]);

  return { totalCompleted, totalPosted, loading };
}
