'use client';

import { Stack, Text, Divider, Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { TodayBanner } from '@/components/admin/dashboard/TodayBanner';
import { WeeklyTrend } from '@/components/admin/dashboard/WeeklyTrend';
import { Leaderboard } from '@/components/admin/dashboard/Leaderboard';
import { DashboardSkeleton } from '@/components/ui/Skeletons';
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats';

export default function AdminDashboard() {
  const stats = useAdminDashboardStats();
  const router = useRouter();

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
        <Stack gap={4}>
          <Text size="xl" fw={700} ta="center">
            לוח בקרה
          </Text>
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconArrowRight size={14} />}
            onClick={() => router.push('/home')}
            mx="auto"
          >
            חזרה לאפליקציה
          </Button>
        </Stack>

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
      </Stack>
    </PageContainer>
  );
}
