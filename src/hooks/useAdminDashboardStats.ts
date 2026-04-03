'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getAllWorkoutsUpTo, getAllCompletionsForUser, getWorkout } from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';
import type { Workout, WorkoutCompletion } from '@/lib/types';

export interface LeaderboardEntry {
  uid: string;
  name: string;
  completed: number;
  total: number;
  percent: number;
  streak: number;
}

export interface DayTrend {
  dateKey: string;
  dayLabel: string;
  percent: number;
  hasWorkout: boolean;
}

export interface AdminDashboardStats {
  loading: boolean;
  sharingCount: number;
  totalEligibleCount: number;
  todayWorkout: Workout | null;
  todayCompletedCount: number;
  allTimeCompletionPercent: number;
  averageStreak: number;
  leaderboard: LeaderboardEntry[];
  weeklyTrend: DayTrend[];
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

const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export function useAdminDashboardStats(): AdminDashboardStats {
  const [stats, setStats] = useState<AdminDashboardStats>({
    loading: true,
    sharingCount: 0,
    totalEligibleCount: 0,
    todayWorkout: null,
    todayCompletedCount: 0,
    allTimeCompletionPercent: 0,
    averageStreak: 0,
    leaderboard: [],
    weeklyTrend: [],
  });

  useEffect(() => {
    async function load() {
      const today = getTodayDateKey();

      const [allUsers, allWorkouts, todayWorkout] = await Promise.all([
        getAllUsers(),
        getAllWorkoutsUpTo(today),
        getWorkout(today),
      ]);

      const sharingUsers = allUsers.filter(
        (u) => u.shareCompletionWithAdmin && u.role !== 'admin' && u.role !== 'guest'
      );
      const totalEligible = allUsers.filter(
        (u) => u.role !== 'admin' && u.role !== 'guest'
      ).length;

      const workoutDateKeys = new Set(allWorkouts.map((w) => w.dateKey));

      // Build last-7-days date keys (including today)
      const last7: string[] = [];
      const cursor7 = new Date();
      for (let i = 0; i < 7; i++) {
        last7.unshift(formatDateKey(cursor7));
        cursor7.setDate(cursor7.getDate() - 1);
      }

      // Fetch all completions per sharing user in parallel
      const completionsByUser = await Promise.all(
        sharingUsers.map((u) => getAllCompletionsForUser(u.uid, today))
      );

      // Build per-user stats
      const leaderboard: LeaderboardEntry[] = sharingUsers.map((u, i) => {
        const comps = completionsByUser[i];
        const completed = comps.filter((c) => c.completed).length;
        const total = allWorkouts.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const streak = computeStreak(comps, workoutDateKeys, today);
        return { uid: u.uid, name: u.displayName, completed, total, percent, streak };
      });

      leaderboard.sort((a, b) => b.percent - a.percent || b.completed - a.completed);

      // Today's completion count
      const todayCompletedCount = completionsByUser.filter((comps) =>
        comps.some((c) => c.dateKey === today && c.completed)
      ).length;

      // All-time completion %: total completed across all users / (total workouts * sharing users)
      const totalPossible = allWorkouts.length * sharingUsers.length;
      const totalCompleted = completionsByUser.reduce(
        (sum, comps) => sum + comps.filter((c) => c.completed).length,
        0
      );
      const allTimeCompletionPercent =
        totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

      // Average streak
      const avgStreak =
        leaderboard.length > 0
          ? Math.round(
              (leaderboard.reduce((sum, e) => sum + e.streak, 0) / leaderboard.length) * 10
            ) / 10
          : 0;

      // Weekly trend
      // Build a map: dateKey -> Set of uids who completed
      const completedByDay = new Map<string, Set<string>>();
      for (const comps of completionsByUser) {
        for (const c of comps) {
          if (c.completed && last7.includes(c.dateKey)) {
            if (!completedByDay.has(c.dateKey)) completedByDay.set(c.dateKey, new Set());
            completedByDay.get(c.dateKey)!.add(c.uid);
          }
        }
      }

      const weeklyTrend: DayTrend[] = last7.map((dk) => {
        const d = new Date(dk + 'T12:00:00');
        const dayLabel = HEBREW_DAYS[d.getDay()];
        const hasWorkout = workoutDateKeys.has(dk);
        const completedCount = completedByDay.get(dk)?.size ?? 0;
        const percent =
          hasWorkout && sharingUsers.length > 0
            ? Math.round((completedCount / sharingUsers.length) * 100)
            : 0;
        return { dateKey: dk, dayLabel, percent, hasWorkout };
      });

      setStats({
        loading: false,
        sharingCount: sharingUsers.length,
        totalEligibleCount: totalEligible,
        todayWorkout,
        todayCompletedCount,
        allTimeCompletionPercent,
        averageStreak: avgStreak,
        leaderboard,
        weeklyTrend,
      });
    }

    load().catch(() => setStats((s) => ({ ...s, loading: false })));
  }, []);

  return stats;
}
