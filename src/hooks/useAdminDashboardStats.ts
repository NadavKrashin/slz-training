'use client';

import { useEffect, useState } from 'react';
import {
  getAllUsers,
  getWorkoutsInRange,
  getWorkoutCount,
  getWorkout,
  getRecentCompletions,
  getCompletionCountForUser,
} from '@/lib/firebase/firestore';
import { getTodayDateKey, formatDateKey } from '@/lib/dates';
import { calcStreak } from '@/lib/streak';
import type { Workout, WorkoutCompletion, UserProfile } from '@/lib/types';

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
  allUsers: UserProfile[];
  sharingCount: number;
  totalEligibleCount: number;
  todayWorkout: Workout | null;
  todayCompletedCount: number;
  todayCompletedUids: Set<string>;
  allTimeCompletionPercent: number;
  averageStreak: number;
  leaderboard: LeaderboardEntry[];
  weeklyTrend: DayTrend[];
}

const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export function useAdminDashboardStats(): AdminDashboardStats {
  const [stats, setStats] = useState<AdminDashboardStats>({
    loading: true,
    allUsers: [],
    sharingCount: 0,
    totalEligibleCount: 0,
    todayWorkout: null,
    todayCompletedCount: 0,
    todayCompletedUids: new Set(),
    allTimeCompletionPercent: 0,
    averageStreak: 0,
    leaderboard: [],
    weeklyTrend: [],
  });

  useEffect(() => {
    async function load() {
      const today = getTodayDateKey();
      const lookback = new Date();
      lookback.setDate(lookback.getDate() - 90);
      const start = formatDateKey(lookback);

      // Phase 1: fetch base data — bounded 90-day range for completions
      const [allUsers, recentWorkouts, todayWorkout, recentCompletions, totalWorkoutCount] =
        await Promise.all([
          getAllUsers(),
          getWorkoutsInRange(start, today),
          getWorkout(today),
          getRecentCompletions(start, today),
          getWorkoutCount(today),
        ]);

      const sharingUsers = allUsers.filter(
        (u) => u.shareCompletionWithAdmin && u.role !== 'admin' && u.role !== 'guest'
      );
      const totalEligible = allUsers.filter(
        (u) => u.role !== 'admin' && u.role !== 'guest'
      ).length;

      const workoutDateKeys = new Set(recentWorkouts.map((w) => w.dateKey));

      // Build last-7-days date keys (including today)
      const last7: string[] = [];
      const cursor7 = new Date();
      for (let i = 0; i < 7; i++) {
        last7.unshift(formatDateKey(cursor7));
        cursor7.setDate(cursor7.getDate() - 1);
      }

      // Group recent completions by uid
      const completionsByUid = new Map<string, WorkoutCompletion[]>();
      for (const c of recentCompletions) {
        if (!completionsByUid.has(c.uid)) completionsByUid.set(c.uid, []);
        completionsByUid.get(c.uid)!.push(c);
      }

      // Phase 2: all-time per-user completed counts (server-side, no doc transfer)
      const allTimeCountsByUser = await Promise.all(
        sharingUsers.map((u) => getCompletionCountForUser(u.uid, today))
      );

      // Today's completion state
      const todayCompletedUids = new Set(
        recentCompletions
          .filter((c) => c.dateKey === today)
          .map((c) => c.uid)
      );
      const todayCompletedCount = sharingUsers.filter((u) => todayCompletedUids.has(u.uid)).length;

      // Leaderboard
      const leaderboard: LeaderboardEntry[] = sharingUsers.map((u, i) => {
        const completed = allTimeCountsByUser[i];
        const total = totalWorkoutCount;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const streak = calcStreak(completionsByUid.get(u.uid) ?? [], workoutDateKeys, today);
        return { uid: u.uid, name: u.displayName, completed, total, percent, streak };
      });

      leaderboard.sort((a, b) => b.percent - a.percent || b.completed - a.completed);

      // All-time completion % across all sharing users
      const totalCompleted = allTimeCountsByUser.reduce((sum, n) => sum + n, 0);
      const totalPossible = totalWorkoutCount * sharingUsers.length;
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
      const completedByDay = new Map<string, Set<string>>();
      for (const c of recentCompletions) {
        if (last7.includes(c.dateKey)) {
          if (!completedByDay.has(c.dateKey)) completedByDay.set(c.dateKey, new Set());
          completedByDay.get(c.dateKey)!.add(c.uid);
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
        allUsers,
        sharingCount: sharingUsers.length,
        totalEligibleCount: totalEligible,
        todayWorkout,
        todayCompletedCount,
        todayCompletedUids,
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
