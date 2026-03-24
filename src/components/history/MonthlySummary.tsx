'use client';

import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCheck, IconFlame, IconChartBar } from '@tabler/icons-react';

interface MonthlySummaryProps { completed: number; missed: number; total: number; streak: number; }

export function MonthlySummary({ completed, total, streak }: MonthlySummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Card>
      <Group justify="space-around">
        <Stack align="center" gap={4}>
          <ThemeIcon size={36} radius="xl" variant="light" color="green"><IconCheck size={20} /></ThemeIcon>
          <Text size="xl" fw={700}>{completed}</Text>
          <Text size="xs" c="dimmed">הושלמו</Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon size={36} radius="xl" variant="light" color="orange"><IconFlame size={20} /></ThemeIcon>
          <Text size="xl" fw={700}>{streak}</Text>
          <Text size="xs" c="dimmed">רצף נוכחי</Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon size={36} radius="xl" variant="light" color="brand"><IconChartBar size={20} /></ThemeIcon>
          <Text size="xl" fw={700}>{percentage}%</Text>
          <Text size="xs" c="dimmed">הצלחה</Text>
        </Stack>
      </Group>
    </Card>
  );
}
