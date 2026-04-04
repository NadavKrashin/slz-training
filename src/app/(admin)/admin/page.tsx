'use client';

import { Stack, Text, Divider } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { TodayBanner } from '@/components/admin/dashboard/TodayBanner';
import { WeeklyTrend } from '@/components/admin/dashboard/WeeklyTrend';
import { Leaderboard } from '@/components/admin/dashboard/Leaderboard';
import { DailyOverview } from '@/components/admin/DailyOverview';
import { DashboardSkeleton } from '@/components/ui/Skeletons';
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats';

export default function AdminDashboard() {
  const stats = useAdminDashboardStats();

  if (stats.loading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">
          לוח בקרה
        </Text>

        <StatCards
          sharingCount={stats.sharingCount}
          totalEligibleCount={stats.totalEligibleCount}
          todayCompletedCount={stats.todayCompletedCount}
          todayTotal={stats.sharingCount}
          hasWorkoutToday={stats.todayWorkout !== null}
          allTimeCompletionPercent={stats.allTimeCompletionPercent}
          averageStreak={stats.averageStreak}
        />

        <TodayBanner
          todayWorkout={stats.todayWorkout}
          completedCount={stats.todayCompletedCount}
          sharingCount={stats.sharingCount}
        />

        <Divider label="מגמה שבועית" />
        <WeeklyTrend trend={stats.weeklyTrend} />

        <Divider label="טבלת מצטיינים" />
        <Leaderboard entries={stats.leaderboard} />

        <Divider label="סקירה יומית" />
        <DailyOverview
          users={stats.allUsers}
          workout={stats.todayWorkout}
          completedUids={stats.todayCompletedUids}
        />
      </Stack>
    </PageContainer>
  );
}
