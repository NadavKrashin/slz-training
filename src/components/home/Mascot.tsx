'use client';

import { Paper, Text, Stack, Group } from '@mantine/core';

interface MascotProps { isCompleted: boolean; message: string; }

export function Mascot({ isCompleted, message }: MascotProps) {
  return (
    <Paper p="md" radius="lg" bg={isCompleted ? 'green.0' : 'brand.0'}>
      <Group align="center" gap="md">
        <Text style={{ fontSize: 64, lineHeight: 1 }}>{isCompleted ? '😄' : '🥺'}</Text>
        <Stack gap={4} style={{ flex: 1 }}>
          <Text size="sm" fw={600} c={isCompleted ? 'green.8' : 'brand.8'}>
            {isCompleted ? 'כל הכבוד! סיימת את האימון!' : 'בוא נתאמן היום!'}
          </Text>
          <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>&ldquo;{message}&rdquo;</Text>
        </Stack>
      </Group>
    </Paper>
  );
}
