'use client';

import { Group, ActionIcon, Text } from '@mantine/core';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

interface MonthNavigatorProps { label: string; onPrev: () => void; onNext: () => void; canGoNext: boolean; }

export function MonthNavigator({ label, onPrev, onNext, canGoNext }: MonthNavigatorProps) {
  return (
    <Group justify="space-between" px="xs">
      <ActionIcon variant="subtle" size="lg" onClick={onNext} disabled={!canGoNext}><IconChevronRight size={20} /></ActionIcon>
      <Text size="lg" fw={700}>{label}</Text>
      <ActionIcon variant="subtle" size="lg" onClick={onPrev}><IconChevronLeft size={20} /></ActionIcon>
    </Group>
  );
}
