'use client';

import { useEffect, useState } from 'react';
import { getAllWorkoutsUpTo, getAllCompletionsForUser } from '@/lib/firebase/firestore';
import { getTodayDateKey } from '@/lib/dates';

export function useAllTimeStatsForUid(uid: string) {
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPosted, setTotalPosted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setTotalCompleted(0);
      setTotalPosted(0);
      setLoading(false);
      return;
    }

    async function calculate() {
      const today = getTodayDateKey();
      const [completions, workouts] = await Promise.all([
        getAllCompletionsForUser(uid, today),
        getAllWorkoutsUpTo(today),
      ]);
      setTotalCompleted(completions.filter((c) => c.completed).length);
      setTotalPosted(workouts.length);
      setLoading(false);
    }

    calculate();
  }, [uid]);

  return { totalCompleted, totalPosted, loading };
}
