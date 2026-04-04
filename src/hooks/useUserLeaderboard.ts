'use client';

import { useEffect, useState } from 'react';
import { getSharingUsers, getWorkoutsInRange, getRecentCompletions } from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';
import { calcStreak } from '@/lib/streak';
import { MAX_STREAK_DAYS } from '@/lib/constants';

export interface UserLeaderboardEntry {
  uid: string;
  name: string;
  streak: number;
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
      const lookback = new Date();
      lookback.setDate(lookback.getDate() - MAX_STREAK_DAYS);
      const start = formatDateKey(lookback);

      const [sharingUsers, workouts, allCompletions] = await Promise.all([
        getSharingUsers(),
        getWorkoutsInRange(start, today),
        getRecentCompletions(start, today),
      ]);

      const workoutDateKeys = new Set(workouts.map((w) => w.dateKey));

      const completionsByUid = new Map<string, typeof allCompletions>();
      for (const c of allCompletions) {
        if (!completionsByUid.has(c.uid)) completionsByUid.set(c.uid, []);
        completionsByUid.get(c.uid)!.push(c);
      }

      const result: UserLeaderboardEntry[] = sharingUsers.map((u) => ({
        uid: u.uid,
        name: u.displayName,
        streak: calcStreak(completionsByUid.get(u.uid) ?? [], workoutDateKeys, today),
      }));

      result.sort((a, b) => b.streak - a.streak);
      setEntries(result);
      setLoading(false);
    }

    load();
  }, [enabled]);

  return { entries, loading };
}
