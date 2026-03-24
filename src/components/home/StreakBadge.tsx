'use client';

import { Group, Text } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <Group gap={6} justify="center" align="center">
      <IconFlame size={18} color={streak > 0 ? '#ffd43b' : 'rgba(255,255,255,0.5)'} />
      <Text size="sm" fw={700} c="white">{streak} ימים רצוף</Text>
    </Group>
  );
}
