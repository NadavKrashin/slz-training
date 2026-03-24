'use client';

import { Overlay, Center, Stack, Button, Text } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';

export function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <Overlay fixed zIndex={300} backgroundOpacity={0.85} color="#000">
      <Center h="100vh">
        <Stack align="center" gap="lg">
          <Text size="2rem" fw={700} c="white">האימון בהשהיה</Text>
          <Text size="md" c="gray.4">לחץ להמשך</Text>
          <Button size="xl" radius="xl" leftSection={<IconPlayerPlay size={24} />} onClick={onResume}>המשך אימון</Button>
        </Stack>
      </Center>
    </Overlay>
  );
}
