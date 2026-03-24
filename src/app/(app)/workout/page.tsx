'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@mantine/core';
import { WorkoutFlow } from '@/components/workout/WorkoutFlow';
import { LoadingState } from '@/components/ui/LoadingState';
import { useTodayWorkout } from '@/hooks/useTodayWorkout';
import { useWorkoutCompletion } from '@/hooks/useWorkoutCompletion';
import { getTodayDateKey } from '@/lib/dates';

export default function WorkoutPage() {
  const { workout, loading: workoutLoading } = useTodayWorkout();
  const dateKey = getTodayDateKey();
  const { isCompleted, loading: completionLoading, markComplete } = useWorkoutCompletion(dateKey);
  const router = useRouter();

  const loading = workoutLoading || completionLoading;

  useEffect(() => {
    if (!loading && !workout) router.replace('/home');
  }, [loading, workout, router]);

  if (loading) return <LoadingState />;
  if (!workout) return null;

  if (isCompleted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: 16,
        background: 'linear-gradient(160deg, #364fc7 0%, #4c6ef5 50%, #5c7cfa 100%)',
      }}>
        <Text ta="center" c="white" fw={600} size="lg">כבר השלמת את האימון של היום! 🎉</Text>
      </div>
    );
  }

  // onComplete only persists — navigation is owned by CompletionScreen
  return (
    <WorkoutFlow
      workout={workout}
      onComplete={() => markComplete(workout.title)}
    />
  );
}
