'use client';

import { Center, Stack, Text, Box } from '@mantine/core';
import { ReactNode } from 'react';
import { SealzStacked } from './Sealz';
import { getFirstMessage } from '@/lib/sealz/messages';

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
            <SealzStacked
              pose="shrugging"
              size="lg"
              message={getFirstMessage('empty')}
              bubbleVariant="light"
            />
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
