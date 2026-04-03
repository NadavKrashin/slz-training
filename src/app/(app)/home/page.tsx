'use client';

import { Stack, Text, Box, Container } from '@mantine/core';
import { IconBarbell } from '@tabler/icons-react';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { StreakBadge } from '@/components/home/StreakBadge';
import { Mascot } from '@/components/home/Mascot';
import { NAV_HEIGHT } from '@/lib/constants';
import { useAppData } from '@/contexts/AppDataContext';

export default function HomePage() {
  const { userData, todayWorkout, isCompleted, currentStreak, motivationalMessage } = useAppData();

  return (
    <Box pb={NAV_HEIGHT + 24}>
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
            <Mascot isCompleted={isCompleted} message={motivationalMessage} />
            <StreakBadge streak={currentStreak} />
          </Stack>
        </Container>
      </Box>

      <Container size="sm" px="md" pt="lg">
        <Stack gap="lg">
          {todayWorkout ? (
            <WorkoutCard workout={todayWorkout} isCompleted={isCompleted} />
          ) : (
            <Box
              p="xl"
              ta="center"
              style={{
                borderRadius: 'var(--mantine-radius-lg)',
                background: 'var(--mantine-color-gray-0)',
              }}
            >
              <Stack align="center" gap="xs">
                <IconBarbell size={32} color="var(--mantine-color-gray-4)" stroke={1.5} />
                <Text c="dimmed" fw={500}>
                  אין אימון מוגדר להיום
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
