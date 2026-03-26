'use client';

import { Stack, Text, Group, Box } from '@mantine/core';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <Stack align="center" gap={4}>
      <Box
        w={72}
        h={80}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--mantine-radius-lg)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Text size="2.5rem" fw={800} c="white" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {String(value).padStart(2, '0')}
        </Text>
      </Box>
      <Text size="xs" fw={500} c="rgba(255,255,255,0.7)">{label}</Text>
    </Stack>
  );
}

function Separator() {
  return (
    <Text size="2rem" fw={700} c="rgba(255,255,255,0.5)" pt={8}>:</Text>
  );
}

export function CountdownTimer({ days, hours, minutes, seconds }: { days: number; hours: number; minutes: number; seconds: number }) {
  return (
    <Group justify="center" gap="sm">
      <TimeUnit value={days} label="ימים" />
      <Separator />
      <TimeUnit value={hours} label="שעות" />
      <Separator />
      <TimeUnit value={minutes} label="דקות" />
      <Separator />
      <TimeUnit value={seconds} label="שניות" />
    </Group>
  );
}
