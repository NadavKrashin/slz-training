import type { SealzPose } from './types';

export type SealzScreen =
  | 'home'
  | 'workout-idle'
  | 'workout-complete'
  | 'pause'
  | 'auth'
  | 'timer'
  | 'timer-no-target'
  | 'profile'
  | 'history'
  | 'empty'
  | 'loading';

export interface PoseContext {
  screen: SealzScreen;
  isCompleted?: boolean;
  hasWorkoutToday?: boolean;
  currentStreak?: number;
  daysSinceLastWorkout?: number;
}

const MILESTONE_STREAKS = [3, 7, 14, 30, 60, 100] as const;

export function isMilestoneStreak(streak: number): boolean {
  return (MILESTONE_STREAKS as readonly number[]).includes(streak);
}

export function selectPose(ctx: PoseContext): SealzPose {
  switch (ctx.screen) {
    case 'home':
      if (ctx.isCompleted) return 'celebrating';
      if (ctx.daysSinceLastWorkout && ctx.daysSinceLastWorkout >= 3) return 'disappointed';
      if (!ctx.hasWorkoutToday) return 'resting';
      return 'encouraging';

    case 'workout-idle':
      return 'ready';

    case 'workout-complete': {
      const streak = ctx.currentStreak ?? 0;
      if (isMilestoneStreak(streak + 1)) return 'celebrating-proud';
      return 'celebrating';
    }

    case 'pause':
      return 'waiting';

    case 'auth':
      return 'waving';

    case 'timer':
      return 'focused';

    case 'timer-no-target':
      return 'shrugging';

    case 'profile': {
      const streak = ctx.currentStreak ?? 0;
      return streak >= 7 ? 'flexing' : 'encouraging';
    }

    case 'history':
      return 'neutral';

    case 'empty':
      return 'shrugging';

    case 'loading':
      return 'waiting';

    default:
      return 'encouraging';
  }
}
