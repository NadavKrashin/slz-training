'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompletionsForUser, getWorkoutsInRange } from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';

// Module-level cache — persists across page navigations within a session.
const _cache = new Map<string, { currentStreak: number; totalCompletions: number }>();

export function useStreak() {
  const { user } = useAuth();

  const cached = user ? _cache.get(user.uid) : undefined;
  const [currentStreak, setCurrentStreak] = useState(cached?.currentStreak ?? 0);
  const [totalCompletions, setTotalCompletions] = useState(cached?.totalCompletions ?? 0);
  const [loading, setLoading] = useState(!cached);

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
      const totalCompleted = completedSet.size;

      let streak = 0;
      const cursor = new Date();
      for (let i = 0; i < 90; i++) {
        const dk = formatDateKey(cursor);
        if (workoutDates.has(dk)) {
          if (completedSet.has(dk)) {
            streak++;
          } else if (dk === today) {
            // Today's workout not yet done — skip without breaking the streak
          } else {
            break;
          }
        }
        cursor.setDate(cursor.getDate() - 1);
      }

      _cache.set(user!.uid, { currentStreak: streak, totalCompletions: totalCompleted });
      setCurrentStreak(streak);
      setTotalCompletions(totalCompleted);
      setLoading(false);
    }

    calculate();
  }, [user]);

  return { currentStreak, totalCompletions, loading };
}
