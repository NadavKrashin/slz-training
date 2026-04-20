'use client';

import { Group, ActionIcon, Text } from '@mantine/core';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

interface MonthNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

export function MonthNavigator({ label, onPrev, onNext, canGoNext }: MonthNavigatorProps) {
  return (
    <Group justify="space-between" px="xs">
      <ActionIcon
        variant="transparent"
        size="lg"
        onClick={onNext}
        c="white"
        style={{ visibility: canGoNext ? 'visible' : 'hidden' }}
      >
        <IconChevronRight size={20} />
      </ActionIcon>
      <Text size="md" fw={600} c="white">
        {label}
      </Text>
      <ActionIcon variant="transparent" size="lg" onClick={onPrev} c="white">
        <IconChevronLeft size={20} />
      </ActionIcon>
    </Group>
  );
}
