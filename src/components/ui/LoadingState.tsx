'use client';

import { Center, Loader, Text, Stack } from '@mantine/core';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'טוען...' }: LoadingStateProps) {
  return (
    <Center py="xl" mih={200}>
      <Stack align="center" gap="sm">
        <Loader color="brand" size="lg" />
        <Text size="sm" c="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}
