'use client';

import { Stack, Text, Badge, Group } from '@mantine/core';
import { IconBarbell, IconZzz } from '@tabler/icons-react';
import type { WorkoutStage } from '@/lib/types';

interface StageDisplayProps { stage: WorkoutStage; stageNumber: number; totalStages: number; inverted?: boolean; }

export function StageDisplay({ stage, stageNumber, totalStages, inverted = false }: StageDisplayProps) {
  const isRest = stage.type === 'rest';

  return (
    <Stack align="center" gap="sm">
      <Text size="sm" c={inverted ? 'rgba(255,255,255,0.7)' : 'dimmed'}>שלב {stageNumber} מתוך {totalStages}</Text>
      <Group gap="sm" align="center">
        {isRest
          ? <IconZzz size={28} color={inverted ? 'rgba(255,255,255,0.9)' : 'var(--mantine-color-teal-6)'} />
          : <IconBarbell size={28} color={inverted ? 'white' : 'var(--mantine-color-brand-6)'} />}
        <Text size="1.75rem" fw={700} c={inverted ? 'white' : undefined}>{stage.name}</Text>
      </Group>
      <Badge
        size="lg"
        variant={inverted ? 'white' : 'light'}
        color={isRest ? 'teal' : 'brand'}
        c={inverted ? (isRest ? 'teal.7' : 'brand.7') : undefined}
      >
        {isRest ? 'מנוחה' : 'תרגיל'}
      </Badge>
    </Stack>
  );
}
