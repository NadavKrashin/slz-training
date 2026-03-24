'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { TimerSettings } from '@/components/admin/TimerSettings';

export default function TimerPage() {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">הגדרות טיימר</Text>
        <TimerSettings />
      </Stack>
    </PageContainer>
  );
}
