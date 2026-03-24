'use client';

import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
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
      <Stack align="center" gap="md">
        {icon || (
          <ThemeIcon size={60} radius="xl" variant="light" color="gray">
            <IconMoodSad size={30} />
          </ThemeIcon>
        )}
        <Text size="lg" fw={600} ta="center">{title}</Text>
        {description && (
          <Text size="sm" c="dimmed" ta="center" maw={300}>{description}</Text>
        )}
      </Stack>
    </Center>
  );
}
