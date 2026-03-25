'use client';

import { useEffect, useState } from 'react';
import { subscribeToWorkout } from '@/lib/firebase/firestore';
import { getTodayDateKey, getMsUntilMidnight } from '@/lib/dates';
import type { Workout } from '@/lib/types';

export function useTodayWorkout() {
  const [dateKey, setDateKey] = useState(getTodayDateKey());
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ms = getMsUntilMidnight();
    const timeout = setTimeout(() => {
      setDateKey(getTodayDateKey());
    }, ms + 1000);
    return () => clearTimeout(timeout);
  }, [dateKey]);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToWorkout(dateKey, (data) => {
      setWorkout(data);
      setLoading(false);
    });
    return unsub;
  }, [dateKey]);

  return { workout, loading, dateKey };
}
