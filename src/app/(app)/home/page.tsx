'use client';

import { Stack, Text, Box, Container } from '@mantine/core';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { StreakBadge } from '@/components/home/StreakBadge';
import { Sealz } from '@/components/ui/Sealz';
import { SealzBubble } from '@/components/ui/SealzBubble';
import { NAV_HEIGHT } from '@/lib/constants';
import { useAppData } from '@/contexts/AppDataContext';
import { selectPose } from '@/lib/sealz/poseSelector';
import { getHomeMessage } from '@/lib/sealz/messages';

export default function HomePage() {
  const { userData, todayWorkout, isCompleted, currentStreak, motivationalMessage } = useAppData();

  const pose = selectPose({
    screen: 'home',
    isCompleted,
    hasWorkoutToday: !!todayWorkout,
  });

  const message = getHomeMessage(
    isCompleted,
    !!todayWorkout,
    undefined,
    motivationalMessage,
  );

  return (
    <Box pb={NAV_HEIGHT + 24}>
      <Box
        style={{
          background: 'linear-gradient(160deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
          borderRadius: '0 0 24px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
        px="md"
        pt={36}
        pb={28}
      >
        {/* Sealz pinned to the left side (visual right in RTL) */}
        <Box
          style={{
            position: 'absolute',
            left: 8,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          <Sealz pose={pose} size="lg" />
        </Box>
        <Container size="sm">
          <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
            <Text size="lg" fw={700} c="white" ta="center">
              שלום, {userData?.displayName || 'חבר/ה'}
            </Text>
            <SealzBubble message={message} tailDirection="left" />
            <StreakBadge streak={currentStreak} />
          </Stack>
        </Container>
      </Box>

      <Container size="sm" px="md" pt="lg">
        <Stack gap="lg">
          {todayWorkout ? (
            <WorkoutCard workout={todayWorkout} isCompleted={isCompleted} />
          ) : (
            <Box p="xl" ta="center">
              <Sealz
                pose="resting"
                size="md"
                message="אין אימון מוגדר להיום"
                bubbleVariant="light"
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
