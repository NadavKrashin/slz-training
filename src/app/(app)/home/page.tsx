'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { StreakBadge } from '@/components/home/StreakBadge';
import { Mascot } from '@/components/home/Mascot';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useUser } from '@/hooks/useUser';
import { useTodayWorkout } from '@/hooks/useTodayWorkout';
import { useWorkoutCompletion } from '@/hooks/useWorkoutCompletion';
import { useStreak } from '@/hooks/useStreak';
import { useMotivationalMessage } from '@/hooks/useMotivationalMessage';
import { getTodayDateKey } from '@/lib/dates';

export default function HomePage() {
  const { userData } = useUser();
  const { workout, loading: workoutLoading } = useTodayWorkout();
  const dateKey = getTodayDateKey();
  const { isCompleted } = useWorkoutCompletion(dateKey);
  const { currentStreak } = useStreak();
  const { message } = useMotivationalMessage();

  return (
    <PageContainer>
      <OfflineBanner />
      <Stack gap="lg">
        <Stack gap={4} align="center">
          <Text size="xl" fw={700}>שלום, {userData?.displayName || 'חבר/ה'} 👋</Text>
        </Stack>

        <Mascot isCompleted={isCompleted} message={message} />
        <StreakBadge streak={currentStreak} />
        {workout && !workoutLoading && <WorkoutCard workout={workout} isCompleted={isCompleted} />}
        {!workout && !workoutLoading && (
          <Text c="dimmed" ta="center">אין אימון מוגדר להיום</Text>
        )}
      </Stack>
    </PageContainer>
  );
}
