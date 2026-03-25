'use client';

import { Center, Stack, Text, ThemeIcon, Box } from '@mantine/core';
import { IconMoodSad } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Center py="xl" mih={200}>
      <Box
        p="xl"
        style={{
          borderRadius: 'var(--mantine-radius-lg)',
          background: 'linear-gradient(135deg, #eef3ff 0%, #dbe4ff 100%)',
        }}
      >
        <Stack align="center" gap="md">
          {icon || (
            <ThemeIcon size={60} radius="xl" variant="light" color="brand">
              <IconMoodSad size={30} />
            </ThemeIcon>
          )}
          <Text size="lg" fw={600} ta="center" c="brand.8">
            {title}
          </Text>
          {description && (
            <Text size="sm" c="brand.5" ta="center" maw={300}>
              {description}
            </Text>
          )}
        </Stack>
      </Box>
    </Center>
  );
}
