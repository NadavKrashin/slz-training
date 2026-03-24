'use client';

import { Stack, Text, RingProgress, Center } from '@mantine/core';
import { formatSeconds } from '@/lib/dates';

interface TimerDisplayProps { remaining: number; total: number; label: string; color?: string; size?: 'sm' | 'lg'; }

export function TimerDisplay({ remaining, total, label, color = 'brand', size = 'lg' }: TimerDisplayProps) {
  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const ringSize = size === 'lg' ? 180 : 120;
  const thickness = size === 'lg' ? 12 : 8;

  return (
    <Stack align="center" gap={4}>
      <RingProgress size={ringSize} thickness={thickness} roundCaps
        sections={[{ value: progress, color: `var(--mantine-color-${color}-6)` }]}
        label={
          <Center>
            <Text size={size === 'lg' ? '2rem' : '1.25rem'} fw={700} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatSeconds(remaining)}
            </Text>
          </Center>
        }
      />
      <Text size="sm" c="dimmed" fw={500}>{label}</Text>
    </Stack>
  );
}
