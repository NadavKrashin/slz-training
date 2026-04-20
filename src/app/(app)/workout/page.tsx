'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutFlow } from '@/components/workout/WorkoutFlow';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAppData } from '@/contexts/AppDataContext';

export default function WorkoutPage() {
  const { todayWorkout: workout, isCompleted, markComplete, loading } = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!workout) router.replace('/home');
  }, [workout, router, loading]);

  useEffect(() => {
    if (loading) return;
    if (isCompleted) router.replace('/home');
  }, [isCompleted, router, loading]);

  if (loading || !workout) return <LoadingState />;
  if (isCompleted) return null;

  // onComplete only persists — navigation is owned by CompletionScreen
  return <WorkoutFlow workout={workout} onComplete={() => markComplete(workout.title)} />;
}
