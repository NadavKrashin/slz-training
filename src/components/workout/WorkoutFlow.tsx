'use client';

import { useState, useCallback } from 'react';
import { Stack, Group, Button, Center, Box, Container } from '@mantine/core';
import { IconPlayerPause, IconPlayerPlay, IconDoorExit } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useStreak } from '@/hooks/useStreak';
import { WORKOUT_DURATION_SECONDS } from '@/lib/constants';
import type { Workout } from '@/lib/types';
import { TimerDisplay } from './TimerDisplay';
import { StageDisplay } from './StageDisplay';
import { ProgressBar } from './ProgressBar';
import { PauseOverlay } from './PauseOverlay';
import { CompletionScreen } from './CompletionScreen';
import { ConfirmModal } from '../ui/ConfirmModal';

interface WorkoutFlowProps {
  workout: Workout;
  onComplete: () => void;
}

export function WorkoutFlow({ workout, onComplete }: WorkoutFlowProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const { currentStreak } = useStreak();
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);
  const timer = useWorkoutTimer(workout.stages, handleComplete);

  if (timer.status === 'completed') return <CompletionScreen streak={currentStreak} />;

  if (timer.status === 'idle') {
    return (
      <Box className="immersive-gradient">
        <Center mih="100dvh">
          <Stack align="center" gap="xl">
            <StageDisplay
              stage={workout.stages[0]}
              stageNumber={1}
              totalStages={workout.stages.length}
              inverted
            />
            <Button
              size="xl"
              radius="xl"
              color="white"
              c="brand.7"
              leftSection={<IconPlayerPlay size={24} />}
              onClick={timer.start}
            >
              התחל אימון
            </Button>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <Box className="immersive-gradient">
      {timer.status === 'paused' && <PauseOverlay onResume={timer.resume} />}
      <Container size="sm" px="md">
        <Stack gap="lg" py="xl">
          <ProgressBar
            currentStage={timer.currentStageIndex}
            totalStages={workout.stages.length}
            inverted
          />
          {timer.currentStage && (
            <StageDisplay
              stage={timer.currentStage}
              stageNumber={timer.currentStageIndex + 1}
              totalStages={workout.stages.length}
              inverted
            />
          )}
          <Group justify="center" gap="xl" py="lg">
            <TimerDisplay
              remaining={timer.stageRemaining}
              total={timer.currentStage?.durationSeconds || 0}
              label="זמן שלב"
              color={timer.currentStage?.type === 'rest' ? 'teal' : 'white'}
              size="lg"
              inverted
            />
            <TimerDisplay
              remaining={timer.totalRemaining}
              total={WORKOUT_DURATION_SECONDS}
              label="זמן כולל"
              color="white"
              size="sm"
              inverted
            />
          </Group>
          <Group justify="center" gap="md">
            <Button
              size="lg"
              radius="xl"
              variant="white"
              c="brand.7"
              leftSection={
                timer.status === 'paused' ? (
                  <IconPlayerPlay size={20} />
                ) : (
                  <IconPlayerPause size={20} />
                )
              }
              onClick={timer.status === 'paused' ? timer.resume : timer.pause}
            >
              {timer.status === 'paused' ? 'המשך' : 'השהיה'}
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="subtle"
              c="rgba(255,255,255,0.7)"
              leftSection={<IconDoorExit size={20} />}
              onClick={() => setShowExitModal(true)}
            >
              יציאה
            </Button>
          </Group>
        </Stack>
      </Container>
      <ConfirmModal
        opened={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => router.push('/home')}
        title="יציאה מהאימון"
        message="אם תצא עכשיו, ההתקדמות לא תישמר. בטוח?"
        confirmLabel="יציאה"
      />
    </Box>
  );
}
