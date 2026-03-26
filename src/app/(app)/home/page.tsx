'use client';

import { Stack, Text, Box, Container } from '@mantine/core';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { StreakBadge } from '@/components/home/StreakBadge';
import { Mascot } from '@/components/home/Mascot';
import { NAV_HEIGHT } from '@/lib/constants';
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
    <Box pb={NAV_HEIGHT + 24}>
      {/* Unified hero: greeting + mascot + streak all inside one gradient */}
      <Box
        style={{
          background: 'linear-gradient(160deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
          borderRadius: '0 0 24px 24px',
        }}
        px="md"
        pt={36}
        pb={28}
      >
        <Container size="sm">
          <Stack gap="md">
            <Text size="lg" fw={700} c="white" ta="center">
              שלום, {userData?.displayName || 'חבר/ה'} 👋
            </Text>
            <Mascot isCompleted={isCompleted} message={message} />
            <StreakBadge streak={currentStreak} />
          </Stack>
        </Container>
      </Box>

      {/* Content below, clean spacing */}
      <Container size="sm" px="md" pt="lg">
        <Stack gap="lg">
          {workout && !workoutLoading && <WorkoutCard workout={workout} isCompleted={isCompleted} />}
          {!workout && !workoutLoading && (
            <Box
              p="xl"
              ta="center"
              style={{
                borderRadius: 'var(--mantine-radius-lg)',
                background: '#f0f2ff',
              }}
            >
              <Text c="brand.6" fw={500}>אין אימון מוגדר להיום</Text>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
