'use client';

import { Progress, Text, Stack } from '@mantine/core';

export function ProgressBar({
  currentStage,
  totalStages,
  inverted = false,
}: {
  currentStage: number;
  totalStages: number;
  inverted?: boolean;
}) {
  const value = totalStages > 0 ? (currentStage / totalStages) * 100 : 0;
  return (
    <Stack gap={4}>
      <Progress
        value={value}
        size="lg"
        radius="xl"
        color={inverted ? 'white' : 'brand'}
        animated
        style={inverted ? { backgroundColor: 'rgba(255,255,255,0.15)' } : undefined}
      />
      <Text size="xs" c={inverted ? 'rgba(255,255,255,0.7)' : 'dimmed'} ta="center">
        {currentStage} / {totalStages} שלבים הושלמו
      </Text>
    </Stack>
  );
}
