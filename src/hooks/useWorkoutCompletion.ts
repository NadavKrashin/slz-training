'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToCompletion, markWorkoutComplete } from '@/lib/firebase/firestore';
import type { WorkoutCompletion } from '@/lib/types';

export function useWorkoutCompletion(dateKey: string) {
  const { user } = useAuth();
  const [completion, setCompletion] = useState<WorkoutCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setCompletion(null); setLoading(false); return; }
    const unsub = subscribeToCompletion(user.uid, dateKey, (data) => { setCompletion(data); setLoading(false); });
    return unsub;
  }, [user, dateKey]);

  const markComplete = useCallback(async (workoutTitle: string) => {
    if (!user) return;
    await markWorkoutComplete(user.uid, dateKey, workoutTitle);
  }, [user, dateKey]);

  const isCompleted = completion?.completed === true;
  return { completion, isCompleted, loading, markComplete };
}
