'use client';

import { useEffect, useRef } from 'react';
import { Center, Stack, Text, Button, ThemeIcon, Box } from '@mantine/core';
import { IconCheck, IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export function CompletionScreen({ streak }: { streak: number }) {
  const newStreak = streak + 1;
  const router = useRouter();
  const confettiFired = useRef(false);

  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
    }, 500);
  }, []);

  return (
    <Box
      style={{
        background: 'linear-gradient(160deg, #364fc7 0%, #4c6ef5 40%, #748ffc 100%)',
        minHeight: '100dvh',
      }}
    >
      <Center mih="100dvh">
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="white" variant="filled" c="brand.6">
            <IconCheck size={48} />
          </ThemeIcon>
          <Text size="2rem" fw={700} ta="center" c="white">כל הכבוד!</Text>
          <Text size="lg" c="rgba(255,255,255,0.8)" ta="center">סיימת את האימון של היום!</Text>
          {newStreak > 0 && (
            <Box
              px="xl"
              py="sm"
              style={{
                borderRadius: 'var(--mantine-radius-xl)',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Text size="xl" fw={700} c="white" ta="center">🔥 {newStreak} ימים רצוף!</Text>
            </Box>
          )}
          <Text style={{ fontSize: 64 }}>🎉</Text>
          <Button size="lg" color="white" c="brand.7" leftSection={<IconHome size={20} />} onClick={() => router.push('/home')}>
            חזרה לדף הבית
          </Button>
        </Stack>
      </Center>
    </Box>
  );
}
