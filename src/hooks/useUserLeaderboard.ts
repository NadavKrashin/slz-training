'use client';

import { useEffect, useState } from 'react';
import { getSharingUsers, getAllWorkoutsUpTo, getAllCompletionsForUser } from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';
import type { WorkoutCompletion } from '@/lib/types';

export interface UserLeaderboardEntry {
  uid: string;
  name: string;
  streak: number;
}

function computeStreak(
  completions: WorkoutCompletion[],
  workoutDateKeys: Set<string>,
  today: string
): number {
  const completedSet = new Set(
    completions.filter((c) => c.completed).map((c) => c.dateKey)
  );
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 90; i++) {
    const dk = formatDateKey(cursor);
    if (workoutDateKeys.has(dk)) {
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
  return streak;
}

export function useUserLeaderboard(enabled = true) {
  const [entries, setEntries] = useState<UserLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    async function load() {
      const today = getTodayDateKey();

      const [sharingUsers, allWorkouts] = await Promise.all([
        getSharingUsers(),
        getAllWorkoutsUpTo(today),
      ]);

      const workoutDateKeys = new Set(allWorkouts.map((w) => w.dateKey));

      const completionsByUser = await Promise.all(
        sharingUsers.map((u) => getAllCompletionsForUser(u.uid, today))
      );

      const result: UserLeaderboardEntry[] = sharingUsers.map((u, i) => ({
        uid: u.uid,
        name: u.displayName,
        streak: computeStreak(completionsByUser[i], workoutDateKeys, today),
      }));

      result.sort((a, b) => b.streak - a.streak);
      setEntries(result);
      setLoading(false);
    }

    load();
  }, [enabled]);

  return { entries, loading };
}
