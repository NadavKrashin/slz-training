import { formatDateKey } from './dates';
import type { WorkoutCompletion } from './types';

export function calcStreak(
  completions: WorkoutCompletion[],
  workoutDateKeys: Set<string>,
  today: string
): number {
  const completedSet = new Set(
    completions.filter((c) => c.completed).map((c) => c.dateKey)
  );
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 90; i++) {
    const dk = formatDateKey(cursor);
    if (workoutDateKeys.has(dk)) {
      if (completedSet.has(dk)) {
        streak++;
      } else if (dk === today) {
        // Today's workout not yet done — skip without breaking the streak
      } else {
        break;
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
