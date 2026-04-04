'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToUser,
  subscribeToWorkout,
  subscribeToCompletion,
  getCompletionsForUser,
  getWorkoutsInRange,
  markWorkoutComplete,
  updateUser,
  getActiveMessages,
} from '@/lib/firebase/firestore';
import { getTodayDateKey, getMsUntilMidnight, formatDateKey } from '@/lib/dates';
import { calcStreak } from '@/lib/streak';
import { MOTIVATIONAL_MESSAGES_SEED, MAX_STREAK_DAYS } from '@/lib/constants';
import type { UserProfile, Workout, WorkoutCompletion } from '@/lib/types';

export interface AppDataContextValue {
  userData: UserProfile | null;
  todayWorkout: Workout | null;
  isCompleted: boolean;
  currentStreak: number;
  motivationalMessage: string;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  markComplete: (workoutTitle: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);


export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [dateKey, setDateKey] = useState(getTodayDateKey);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Three channels must each deliver one value before we drop the loading screen
  const ready = useRef({ user: false, workout: false, completion: false });
  const markReady = (key: 'user' | 'workout' | 'completion') => {
    ready.current[key] = true;
    if (ready.current.user && ready.current.workout && ready.current.completion) {
      setLoading(false);
    }
  };

  // Midnight rollover
  useEffect(() => {
    const t = setTimeout(() => setDateKey(getTodayDateKey()), getMsUntilMidnight() + 1000);
    return () => clearTimeout(t);
  }, [dateKey]);

  // Streak fetch — called on mount, on completion toggle, every 5 min, on foreground
  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const today = getTodayDateKey();
    const lookback = new Date();
    lookback.setDate(lookback.getDate() - MAX_STREAK_DAYS);
    const start = formatDateKey(lookback);
    const [comps, workouts] = await Promise.all([
      getCompletionsForUser(user.uid, start, today),
      getWorkoutsInRange(start, today),
    ]);
    setCurrentStreak(calcStreak(comps, new Set(workouts.map((w) => w.dateKey)), today));
  }, [user]);

  // User profile subscription
  useEffect(() => {
    if (authLoading) return; // Auth not settled — keep loading=true until we know the user
    if (!user) {
      setLoading(false);
      return;
    }
    // Reset for new user session
    setLoading(true);
    ready.current = { user: false, workout: false, completion: false };
    return subscribeToUser(user.uid, (d) => {
      setUserData(d);
      markReady('user');
    });
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Today's workout subscription
  useEffect(() => {
    if (!user) return;
    return subscribeToWorkout(dateKey, (d) => {
      setTodayWorkout(d);
      markReady('workout');
    });
  }, [user, dateKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Today's completion subscription — also triggers streak refresh on change
  const prevCompleted = useRef(false);
  useEffect(() => {
    if (!user) return;
    prevCompleted.current = false;
    return subscribeToCompletion(user.uid, dateKey, (d) => {
      const completed = d?.completed === true;
      setIsCompleted(completed);
      markReady('completion');
      if (completed !== prevCompleted.current) {
        prevCompleted.current = completed;
        fetchStreak();
      }
    });
  }, [user, dateKey, fetchStreak]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial streak + periodic 5-min refresh
  useEffect(() => {
    if (!user) return;
    fetchStreak();
    const id = setInterval(fetchStreak, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [user, fetchStreak]);

  // Refresh streak when app comes to foreground
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') fetchStreak(); };
    document.addEventListener('visibilitychange', h);
    return () => document.removeEventListener('visibilitychange', h);
  }, [fetchStreak]);

  // Motivational message — fetch once per session
  const messageFetched = useRef(false);
  useEffect(() => {
    if (!user || messageFetched.current) return;
    messageFetched.current = true;
    getActiveMessages()
      .then((msgs) => {
        const texts = msgs.length > 0 ? msgs.map((m) => m.text) : MOTIVATIONAL_MESSAGES_SEED;
        setMotivationalMessage(texts[Math.floor(Math.random() * texts.length)]);
      })
      .catch(() => {
        setMotivationalMessage(
          MOTIVATIONAL_MESSAGES_SEED[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES_SEED.length)]
        );
      });
  }, [user]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return;
      await updateUser(user.uid, data);
    },
    [user]
  );

  const markComplete = useCallback(
    async (workoutTitle: string) => {
      if (!user) return;
      await markWorkoutComplete(user.uid, dateKey, workoutTitle);
    },
    [user, dateKey]
  );

  return (
    <AppDataContext.Provider
      value={{ userData, todayWorkout, isCompleted, currentStreak, motivationalMessage, loading, updateProfile, markComplete }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
