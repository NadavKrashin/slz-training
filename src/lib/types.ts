import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  shareCompletionWithAdmin: boolean;
  role: 'user' | 'admin' | 'guest';
  fcmToken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WorkoutStage {
  id: string;
  name: string;
  type: 'exercise' | 'rest';
  durationSeconds: number;
  order: number;
  description?: string;
  gifUrl?: string;
}

export interface Workout {
  dateKey: string;
  title: string;
  description?: string;
  stages: WorkoutStage[];
  totalDurationSeconds: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WorkoutCompletion {
  uid: string;
  dateKey: string;
  completed: boolean;
  completedAt: Timestamp | null;
  workoutTitle: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AppSettings {
  timezone: string;
  sportDayDueDate: Timestamp;
}

export interface MotivationalMessage {
  id: string;
  text: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DayStatus = 'completed' | 'missed' | 'neutral' | 'future';

export type WorkoutFlowStatus = 'idle' | 'running' | 'paused' | 'completed';
