'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompletionsForUser, getWorkoutsInRange } from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';

export function useStreak() {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentStreak(0);
      setTotalCompletions(0);
      setLoading(false);
      return;
    }

    async function calculate() {
      const today = getTodayDateKey();
      const lookback = new Date();
      lookback.setDate(lookback.getDate() - 90);
      const start = formatDateKey(lookback);

      const [completions, workouts] = await Promise.all([
        getCompletionsForUser(user!.uid, start, today),
        getWorkoutsInRange(start, today),
      ]);

      const completedSet = new Set(completions.filter((c) => c.completed).map((c) => c.dateKey));
      const workoutDates = new Set(workouts.map((w) => w.dateKey));
      setTotalCompletions(completedSet.size);

      let streak = 0;
      const cursor = new Date();
      for (let i = 0; i < 90; i++) {
        const dk = formatDateKey(cursor);
        if (workoutDates.has(dk)) {
          if (completedSet.has(dk)) {
            streak++;
          } else {
            break;
          }
        }
        cursor.setDate(cursor.getDate() - 1);
      }
      setCurrentStreak(streak);
      setLoading(false);
    }
    calculate();
  }, [user]);

  return { currentStreak, totalCompletions, loading };
}
