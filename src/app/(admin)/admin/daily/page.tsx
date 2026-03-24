'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { DailyOverview } from '@/components/admin/DailyOverview';

export default function DailyPage() {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">סקירה יומית</Text>
        <DailyOverview />
      </Stack>
    </PageContainer>
  );
}
