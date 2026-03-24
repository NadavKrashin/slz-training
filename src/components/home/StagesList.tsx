'use client';

import { Stack, Group, Text, Badge } from '@mantine/core';
import { IconBarbell, IconZzz } from '@tabler/icons-react';
import { formatSeconds } from '@/lib/dates';
import type { WorkoutStage } from '@/lib/types';

export function StagesList({ stages }: { stages: WorkoutStage[] }) {
  return (
    <Stack gap="xs">
      {stages.sort((a, b) => a.order - b.order).map((stage, index) => (
        <Group key={stage.id} justify="space-between" py={6}>
          <Group gap="sm">
            <Text size="sm" c="dimmed" w={20} ta="center">{index + 1}</Text>
            {stage.type === 'exercise'
              ? <IconBarbell size={18} color="var(--mantine-color-brand-6)" />
              : <IconZzz size={18} color="var(--mantine-color-teal-6)" />}
            <Text size="sm">{stage.name}</Text>
          </Group>
          <Group gap="xs">
            <Badge variant="light" color={stage.type === 'exercise' ? 'brand' : 'teal'} size="sm">
              {stage.type === 'exercise' ? 'תרגיל' : 'מנוחה'}
            </Badge>
            <Text size="sm" fw={600} c="dimmed">{formatSeconds(stage.durationSeconds)}</Text>
          </Group>
        </Group>
      ))}
    </Stack>
  );
}
