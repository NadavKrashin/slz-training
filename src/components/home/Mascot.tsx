'use client';

import { Box, Text, Stack, Group } from '@mantine/core';

interface MascotProps {
  isCompleted: boolean;
  message: string;
}

export function Mascot({ isCompleted, message }: MascotProps) {
  return (
    <Box
      px="md"
      py="sm"
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        background: isCompleted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
      }}
    >
      <Group align="center" gap="md">
        <Text style={{ fontSize: 48, lineHeight: 1 }}>{isCompleted ? '🎉' : '💪'}</Text>
        <Stack gap={2} style={{ flex: 1 }}>
          <Text size="sm" fw={700} c="white">
            {isCompleted ? 'כל הכבוד! סיימת את האימון!' : 'בוא נתאמן היום!'}
          </Text>
          <Text size="xs" c="rgba(255,255,255,0.75)" style={{ fontStyle: 'italic' }}>
            &ldquo;{message}&rdquo;
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
