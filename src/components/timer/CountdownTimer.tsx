'use client';

import { Stack, Text, Card, Group } from '@mantine/core';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <Stack align="center" gap={0}>
      <Text size="3rem" fw={700} c="brand.6" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(value).padStart(2, '0')}</Text>
      <Text size="sm" c="dimmed">{label}</Text>
    </Stack>
  );
}

export function CountdownTimer({ days, hours, minutes, seconds }: { days: number; hours: number; minutes: number; seconds: number }) {
  return (
    <Card p="xl">
      <Group justify="center" gap="lg">
        <TimeUnit value={days} label="ימים" />
        <Text size="2rem" fw={700} c="dimmed" pt="xs">:</Text>
        <TimeUnit value={hours} label="שעות" />
        <Text size="2rem" fw={700} c="dimmed" pt="xs">:</Text>
        <TimeUnit value={minutes} label="דקות" />
        <Text size="2rem" fw={700} c="dimmed" pt="xs">:</Text>
        <TimeUnit value={seconds} label="שניות" />
      </Group>
    </Card>
  );
}
