'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (!loading && isCompleted) router.replace('/home');
  }, [loading, isCompleted, router]);

  if (loading) return <LoadingState />;
  if (!workout) return null;
  if (isCompleted) return null;

  // onComplete only persists — navigation is owned by CompletionScreen
  return <WorkoutFlow workout={workout} onComplete={() => markComplete(workout.title)} />;
}
