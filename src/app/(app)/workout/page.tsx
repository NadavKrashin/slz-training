'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutFlow } from '@/components/workout/WorkoutFlow';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAppData } from '@/contexts/AppDataContext';

export default function WorkoutPage() {
  const { todayWorkout: workout, isCompleted, markComplete } = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (!workout) router.replace('/home');
  }, [workout, router]);

  useEffect(() => {
    if (isCompleted) router.replace('/home');
  }, [isCompleted, router]);

  if (!workout) return <LoadingState />;
  if (isCompleted) return null;

  // onComplete only persists — navigation is owned by CompletionScreen
  return <WorkoutFlow workout={workout} onComplete={() => markComplete(workout.title)} />;
}
