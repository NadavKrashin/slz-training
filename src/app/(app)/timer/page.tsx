'use client';

import { Stack, Text, Box, Center } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { useSportDayTimer } from '@/hooks/useSportDayTimer';
import { NAV_HEIGHT } from '@/lib/constants';

export default function TimerPage() {
  const { days, hours, minutes, seconds, loading, hasTarget } = useSportDayTimer();

  return (
    <Box
      pb={NAV_HEIGHT + 24}
      style={{
        background: 'linear-gradient(160deg, #364fc7 0%, #4c6ef5 40%, #5c7cfa 100%)',
        minHeight: '100dvh',
      }}
    >
      <Center mih={`calc(100dvh - ${NAV_HEIGHT + 24}px)`}>
        <Stack gap="xl" align="center" px="md">
          <Stack align="center" gap={8}>
            <IconClock size={28} color="rgba(255,255,255,0.7)" />
            <Text size="lg" fw={700} c="white">יום ספורט</Text>
          </Stack>
          {loading ? (
            <Text c="rgba(255,255,255,0.7)">טוען...</Text>
          ) : hasTarget ? (
            <CountdownTimer days={days} hours={hours} minutes={minutes} seconds={seconds} />
          ) : (
            <Text c="rgba(255,255,255,0.6)" ta="center">לא הוגדר תאריך ליום הספורט</Text>
          )}
        </Stack>
      </Center>
    </Box>
  );
}
