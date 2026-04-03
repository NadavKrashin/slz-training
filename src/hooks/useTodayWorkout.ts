'use client';

import { useEffect, useState } from 'react';
import { subscribeToWorkout } from '@/lib/firebase/firestore';
import { getTodayDateKey, getMsUntilMidnight } from '@/lib/dates';
import type { Workout } from '@/lib/types';

// Module-level cache — persists across page navigations within a session.
let _cachedDateKey: string | null = null;
let _cachedWorkout: Workout | null = null;
let _workoutLoaded = false;

export function useTodayWorkout() {
  const [dateKey, setDateKey] = useState(getTodayDateKey());

  const hasCached = _workoutLoaded && dateKey === _cachedDateKey;
  const [workout, setWorkout] = useState<Workout | null>(hasCached ? _cachedWorkout : null);
  const [loading, setLoading] = useState(!hasCached);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const newKey = getTodayDateKey();
        if (newKey !== dateKey) setDateKey(newKey);
      }, 1000);
      return () => clearInterval(interval);
    }
    const ms = getMsUntilMidnight();
    const timeout = setTimeout(() => setDateKey(getTodayDateKey()), ms + 1000);
    return () => clearTimeout(timeout);
  }, [dateKey]);

  useEffect(() => {
    // Only show loading spinner if we have no cached data for this date
    if (dateKey !== _cachedDateKey) setLoading(true);
    const unsub = subscribeToWorkout(dateKey, (data) => {
      _cachedDateKey = dateKey;
      _cachedWorkout = data;
      _workoutLoaded = true;
      setWorkout(data);
      setLoading(false);
    });
    return unsub;
  }, [dateKey]);

  return { workout, loading, dateKey };
}
