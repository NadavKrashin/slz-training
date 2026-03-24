'use client';

import { useEffect, useRef } from 'react';
import { Center, Stack, Text, Button, ThemeIcon } from '@mantine/core';
import { IconCheck, IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

/**
 * `streak` is the pre-completion streak from useStreak (doesn't include today yet).
 * We show streak + 1 because today's workout was just completed.
 */
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
    <Center mih="80vh">
      <Stack align="center" gap="lg">
        <ThemeIcon size={80} radius="xl" color="green" variant="filled"><IconCheck size={48} /></ThemeIcon>
        <Text size="2rem" fw={700} ta="center">כל הכבוד!</Text>
        <Text size="lg" c="dimmed" ta="center">סיימת את האימון של היום!</Text>
        {newStreak > 0 && <Text size="xl" fw={700} c="orange.6" ta="center">🔥 {newStreak} ימים רצוף!</Text>}
        <Text style={{ fontSize: 64 }}>🎉</Text>
        <Button size="lg" leftSection={<IconHome size={20} />} onClick={() => router.push('/home')}>חזרה לדף הבית</Button>
      </Stack>
    </Center>
  );
}
