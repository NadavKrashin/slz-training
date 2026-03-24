'use client';

import { Progress, Text, Stack } from '@mantine/core';

export function ProgressBar({ currentStage, totalStages }: { currentStage: number; totalStages: number }) {
  const value = totalStages > 0 ? (currentStage / totalStages) * 100 : 0;
  return (
    <Stack gap={4}>
      <Progress value={value} size="md" radius="xl" color="brand" animated />
      <Text size="xs" c="dimmed" ta="center">{currentStage} / {totalStages} שלבים הושלמו</Text>
    </Stack>
  );
}
