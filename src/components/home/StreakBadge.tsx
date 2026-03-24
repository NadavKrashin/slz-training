'use client';

import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <Group gap={6} align="center">
      <ThemeIcon size={32} radius="xl" variant="light" color={streak > 0 ? 'orange' : 'gray'}>
        <IconFlame size={18} />
      </ThemeIcon>
      <Text size="lg" fw={700} c={streak > 0 ? 'orange.7' : 'gray.5'}>{streak}</Text>
      <Text size="sm" c="dimmed">ימים רצוף</Text>
    </Group>
  );
}
