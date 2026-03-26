'use client';

import { Stack, Text, RingProgress, Center } from '@mantine/core';
import { formatSeconds } from '@/lib/dates';

interface TimerDisplayProps {
  remaining: number;
  total: number;
  label: string;
  color?: string;
  size?: 'sm' | 'lg';
  inverted?: boolean;
}

export function TimerDisplay({ remaining, total, label, color = 'brand', size = 'lg', inverted = false }: TimerDisplayProps) {
  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const ringSize = size === 'lg' ? 180 : 120;
  const thickness = size === 'lg' ? 14 : 10;
  const ringColor = color === 'white' ? 'rgba(255,255,255,0.9)' : `var(--mantine-color-${color}-6)`;
  const trackColor = inverted ? 'rgba(255,255,255,0.15)' : undefined;

  return (
    <Stack align="center" gap={4}>
      <RingProgress
        size={ringSize}
        thickness={thickness}
        roundCaps
        rootColor={trackColor}
        sections={[{ value: progress, color: ringColor }]}
        label={
          <Center>
            <Text
              size={size === 'lg' ? '2rem' : '1.25rem'}
              fw={700}
              c={inverted ? 'white' : undefined}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatSeconds(remaining)}
            </Text>
          </Center>
        }
      />
      <Text size="sm" c={inverted ? 'rgba(255,255,255,0.7)' : 'dimmed'} fw={500}>{label}</Text>
    </Stack>
  );
}
