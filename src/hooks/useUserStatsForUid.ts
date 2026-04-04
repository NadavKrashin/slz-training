'use client';

import { useEffect, useState } from 'react';
import {
  getWorkoutsInRange,
  getCompletionsForUser,
  getCompletionCountForUser,
  getWorkoutCount,
} from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';
import { calcStreak } from '@/lib/streak';

export function useUserStatsForUid(uid: string) {
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPosted, setTotalPosted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setTotalCompleted(0);
      setTotalPosted(0);
      setCurrentStreak(0);
      setLoading(false);
      return;
    }

    async function calculate() {
      try {
        const today = getTodayDateKey();
        const lookback = new Date();
        lookback.setDate(lookback.getDate() - 90);
        const start = formatDateKey(lookback);

        // Fetch 90-day range for streak + server-side counts for all-time stats — all in parallel
        const [recentWorkouts, recentCompletions, completedCount, workoutCount] = await Promise.all([
          getWorkoutsInRange(start, today),
          getCompletionsForUser(uid, start, today),
          getCompletionCountForUser(uid, today),
          getWorkoutCount(today),
        ]);

        setCurrentStreak(
          calcStreak(recentCompletions, new Set(recentWorkouts.map((w) => w.dateKey)), today)
        );
        setTotalCompleted(completedCount);
        setTotalPosted(workoutCount);
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [uid]);

  return { totalCompleted, totalPosted, currentStreak, loading };
}
