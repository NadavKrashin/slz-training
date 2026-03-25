'use client';

import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCheck, IconFlame, IconChartBar } from '@tabler/icons-react';

interface MonthlySummaryProps {
  completed: number;
  missed: number;
  total: number;
  streak: number;
}

export function MonthlySummary({ completed, total, streak }: MonthlySummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Card style={{ background: 'linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%)' }}>
      <Group justify="space-around">
        <Stack align="center" gap={4}>
          <ThemeIcon size={40} radius="xl" color="white" variant="filled" c="brand.6">
            <IconCheck size={22} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="white">
            {completed}
          </Text>
          <Text size="xs" c="rgba(255,255,255,0.7)">
            הושלמו
          </Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon size={40} radius="xl" color="white" variant="filled" c="orange.6">
            <IconFlame size={22} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="white">
            {streak}
          </Text>
          <Text size="xs" c="rgba(255,255,255,0.7)">
            רצף נוכחי
          </Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon size={40} radius="xl" color="white" variant="filled" c="brand.6">
            <IconChartBar size={22} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="white">
            {percentage}%
          </Text>
          <Text size="xs" c="rgba(255,255,255,0.7)">
            הצלחה
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
