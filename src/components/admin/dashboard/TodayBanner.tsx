'use client';

import { Card, Stack, Text, Group, Badge, Progress } from '@mantine/core';
import type { Workout } from '@/lib/types';

interface TodayBannerProps {
  todayWorkout: Workout | null;
  completedCount: number;
  sharingCount: number;
}

export function TodayBanner({ todayWorkout, completedCount, sharingCount }: TodayBannerProps) {
  if (!todayWorkout) {
    return (
      <Card>
        <Text c="dimmed" ta="center" size="sm">
          אין אימון מוגדר להיום
        </Text>
      </Card>
    );
  }

  const percent = sharingCount > 0 ? Math.round((completedCount / sharingCount) * 100) : 0;

  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%)',
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600} c="white" size="sm">
            אימון היום
          </Text>
          <Badge variant="white" color="brand" size="sm">
            {todayWorkout.title}
          </Badge>
        </Group>
        <Progress
          value={percent}
          size="md"
          radius="xl"
          color="white"
          style={{ background: 'rgba(255,255,255,0.3)' }}
        />
        <Text size="xs" c="rgba(255,255,255,0.85)" ta="center">
          {completedCount}/{sharingCount} השלימו ({percent}%)
        </Text>
      </Stack>
    </Card>
  );
}
