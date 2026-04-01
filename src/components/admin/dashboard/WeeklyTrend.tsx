'use client';

import { Group, Card, Stack, Text } from '@mantine/core';
import type { DayTrend } from '@/hooks/useAdminDashboardStats';

interface WeeklyTrendProps {
  trend: DayTrend[];
}

function trendColor(percent: number, hasWorkout: boolean): string {
  if (!hasWorkout) return 'dimmed';
  if (percent >= 70) return 'green';
  if (percent >= 40) return 'orange';
  return 'red';
}

export function WeeklyTrend({ trend }: WeeklyTrendProps) {
  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">
        מגמה שבועית
      </Text>
      <Group gap="xs" grow>
        {trend.map((day) => (
          <Card key={day.dateKey} padding="xs">
            <Stack align="center" gap={2}>
              <Text size="xs" c="dimmed">
                {day.dayLabel}
              </Text>
              <Text
                size="sm"
                fw={700}
                c={trendColor(day.percent, day.hasWorkout)}
              >
                {day.hasWorkout ? `${day.percent}%` : '—'}
              </Text>
            </Stack>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}
