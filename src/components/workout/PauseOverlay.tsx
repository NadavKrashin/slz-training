'use client';

import { Overlay, Center, Stack, Button, Text } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';

export function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <Overlay fixed zIndex={300} backgroundOpacity={0.9} color="#1a1b3a">
      <Center h="100vh">
        <Stack align="center" gap="lg">
          <Text size="2rem" fw={700} c="white">
            האימון בהשהיה
          </Text>
          <Text size="md" c="rgba(255,255,255,0.6)">
            לחץ להמשך
          </Text>
          <Button
            size="xl"
            radius="xl"
            color="white"
            c="brand.7"
            leftSection={<IconPlayerPlay size={24} />}
            onClick={onResume}
          >
            המשך אימון
          </Button>
        </Stack>
      </Center>
    </Overlay>
  );
}
