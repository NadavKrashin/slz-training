'use client';

import { Overlay, Center, Stack, Button, Text, ScrollArea } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import type { WorkoutStage } from '@/lib/types';

interface PauseOverlayProps {
  onResume: () => void;
  stage?: WorkoutStage;
}

export function PauseOverlay({ onResume, stage }: PauseOverlayProps) {
  const hasDescription = stage?.type === 'exercise' && !!stage.description;
  const hasGif = stage?.type === 'exercise' && !!stage.gifUrl;

  return (
    <Overlay fixed zIndex={300} backgroundOpacity={0.9} color="#1a1b3a">
      <ScrollArea h="100vh">
        <Center mih="100vh" py="xl">
          <Stack align="center" gap="lg" maw={400} px="md">
            <Text size="2rem" fw={700} c="white">
              האימון בהשהיה
            </Text>

            {(hasDescription || hasGif) && (
              <Stack align="center" gap="md" w="100%">
                <Text size="lg" fw={600} c="white">
                  {stage!.name}
                </Text>
                {hasDescription && (
                  <Text size="sm" c="rgba(255,255,255,0.8)" ta="center" style={{ whiteSpace: 'pre-wrap' }}>
                    {stage!.description}
                  </Text>
                )}
                {hasGif && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stage!.gifUrl}
                    alt={stage!.name}
                    style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 12, objectFit: 'contain' }}
                  />
                )}
              </Stack>
            )}

            {!hasDescription && !hasGif && (
              <Text size="md" c="rgba(255,255,255,0.6)">
                לחץ להמשך
              </Text>
            )}

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
      </ScrollArea>
    </Overlay>
  );
}
