'use client';

import { useEffect, useState } from 'react';
import { subscribeToAppSettings } from '@/lib/firebase/firestore';
import { now } from '@/lib/clock';

interface CountdownValues {
  days: number; hours: number; minutes: number; seconds: number;
  total: number; loading: boolean; hasTarget: boolean;
}

export function useSportDayTimer(): CountdownValues {
  const [targetMs, setTargetMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(now());

  useEffect(() => {
    const unsub = subscribeToAppSettings((settings) => {
      if (settings?.sportDayDueDate) { setTargetMs(settings.sportDayDueDate.toMillis()); }
      else { setTargetMs(null); }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || targetMs === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, loading, hasTarget: false };
  }

  const diff = Math.max(0, targetMs - current);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, total: totalSeconds, loading, hasTarget: true };
}
