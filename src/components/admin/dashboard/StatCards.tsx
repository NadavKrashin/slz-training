'use client';

import { SimpleGrid, Card, Stack, Text } from '@mantine/core';

interface StatCardsProps {
  sharingCount: number;
  totalEligibleCount: number;
  todayCompletedCount: number;
  todayTotal: number;
  hasWorkoutToday: boolean;
  allTimeCompletionPercent: number;
  averageStreak: number;
}

export function StatCards({
  sharingCount,
  totalEligibleCount,
  todayCompletedCount,
  todayTotal,
  hasWorkoutToday,
  allTimeCompletionPercent,
  averageStreak,
}: StatCardsProps) {
  const todayPercent =
    hasWorkoutToday && todayTotal > 0
      ? Math.round((todayCompletedCount / todayTotal) * 100)
      : null;

  return (
    <SimpleGrid cols={2} spacing="sm">
      <Card>
        <Stack align="center" gap={4}>
          <Text size="xl" fw={700} c="brand">
            {sharingCount}/{totalEligibleCount}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            משתפים מידע
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack align="center" gap={4}>
          <Text
            size="xl"
            fw={700}
            c={
              todayPercent === null
                ? 'dimmed'
                : todayPercent >= 70
                  ? 'green'
                  : todayPercent >= 40
                    ? 'orange'
                    : 'red'
            }
          >
            {todayPercent === null ? '—' : `${todayPercent}%`}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            {hasWorkoutToday ? `${todayCompletedCount}/${todayTotal} השלמה היום` : 'אין אימון היום'}
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack align="center" gap={4}>
          <Text
            size="xl"
            fw={700}
            c={
              allTimeCompletionPercent >= 70
                ? 'green'
                : allTimeCompletionPercent >= 40
                  ? 'orange'
                  : allTimeCompletionPercent > 0
                    ? 'red'
                    : 'dimmed'
            }
          >
            {allTimeCompletionPercent > 0 ? `${allTimeCompletionPercent}%` : '—'}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            השלמה כללית
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack align="center" gap={4}>
          <Text size="xl" fw={700} c="orange">
            {averageStreak > 0 ? averageStreak : '—'}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            רצף ממוצע (ימים)
          </Text>
        </Stack>
      </Card>
    </SimpleGrid>
  );
}
