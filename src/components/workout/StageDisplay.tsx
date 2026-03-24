'use client';

import { Stack, Text, Badge, Group } from '@mantine/core';
import { IconBarbell, IconZzz } from '@tabler/icons-react';
import type { WorkoutStage } from '@/lib/types';

interface StageDisplayProps { stage: WorkoutStage; stageNumber: number; totalStages: number; }

export function StageDisplay({ stage, stageNumber, totalStages }: StageDisplayProps) {
  const isRest = stage.type === 'rest';

  return (
    <Stack align="center" gap="sm">
      <Text size="sm" c="dimmed">שלב {stageNumber} מתוך {totalStages}</Text>
      <Group gap="sm" align="center">
        {isRest ? <IconZzz size={28} color="var(--mantine-color-teal-6)" /> : <IconBarbell size={28} color="var(--mantine-color-brand-6)" />}
        <Text size="1.75rem" fw={700}>{stage.name}</Text>
      </Group>
      <Badge size="lg" variant="light" color={isRest ? 'teal' : 'brand'}>{isRest ? 'מנוחה' : 'תרגיל'}</Badge>
    </Stack>
  );
}
