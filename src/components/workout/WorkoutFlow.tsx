'use client';

import { useState, useCallback } from 'react';
import { Stack, Group, Button, Center } from '@mantine/core';
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

interface WorkoutFlowProps { workout: Workout; onComplete: () => void; }

export function WorkoutFlow({ workout, onComplete }: WorkoutFlowProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const { currentStreak } = useStreak();
  const handleComplete = useCallback(() => { onComplete(); }, [onComplete]);
  const timer = useWorkoutTimer(workout.stages, handleComplete);

  if (timer.status === 'completed') return <CompletionScreen streak={currentStreak} />;

  if (timer.status === 'idle') {
    return (
      <Center mih="80vh">
        <Stack align="center" gap="xl">
          <StageDisplay stage={workout.stages[0]} stageNumber={1} totalStages={workout.stages.length} />
          <Button size="xl" radius="xl" leftSection={<IconPlayerPlay size={24} />} onClick={timer.start}>התחל אימון</Button>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      {timer.status === 'paused' && <PauseOverlay onResume={timer.resume} />}
      <Stack gap="lg" py="md">
        <ProgressBar currentStage={timer.currentStageIndex} totalStages={workout.stages.length} />
        {timer.currentStage && (
          <StageDisplay stage={timer.currentStage} stageNumber={timer.currentStageIndex + 1} totalStages={workout.stages.length} />
        )}
        <Group justify="center" gap="xl" py="lg">
          <TimerDisplay remaining={timer.stageRemaining} total={timer.currentStage?.durationSeconds || 0} label="זמן שלב" color={timer.currentStage?.type === 'rest' ? 'teal' : 'brand'} size="lg" />
          <TimerDisplay remaining={timer.totalRemaining} total={WORKOUT_DURATION_SECONDS} label="זמן כולל" color="gray" size="sm" />
        </Group>
        <Group justify="center" gap="md">
          <Button size="lg" radius="xl" variant="light"
            leftSection={timer.status === 'paused' ? <IconPlayerPlay size={20} /> : <IconPlayerPause size={20} />}
            onClick={timer.status === 'paused' ? timer.resume : timer.pause}>
            {timer.status === 'paused' ? 'המשך' : 'השהיה'}
          </Button>
          <Button size="lg" radius="xl" variant="subtle" color="red" leftSection={<IconDoorExit size={20} />} onClick={() => setShowExitModal(true)}>יציאה</Button>
        </Group>
      </Stack>
      <ConfirmModal opened={showExitModal} onClose={() => setShowExitModal(false)} onConfirm={() => router.push('/home')} title="יציאה מהאימון" message="אם תצא עכשיו, ההתקדמות לא תישמר. בטוח?" confirmLabel="יציאה" />
    </>
  );
}
