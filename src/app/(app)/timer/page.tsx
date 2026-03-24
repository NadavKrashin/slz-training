'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { useSportDayTimer } from '@/hooks/useSportDayTimer';

export default function TimerPage() {
  const { days, hours, minutes, seconds, loading, hasTarget } = useSportDayTimer();

  return (
    <PageContainer>
      <Stack gap="lg" align="center">
        <Text size="xl" fw={700}>יום ספורט</Text>
        {loading ? (
          <Text c="dimmed">טוען...</Text>
        ) : hasTarget ? (
          <CountdownTimer days={days} hours={hours} minutes={minutes} seconds={seconds} />
        ) : (
          <Text c="dimmed">לא הוגדר תאריך ליום הספורט</Text>
        )}
      </Stack>
    </PageContainer>
  );
}
