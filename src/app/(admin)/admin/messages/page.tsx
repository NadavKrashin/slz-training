'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { MessagesList } from '@/components/admin/MessagesList';

export default function MessagesPage() {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">
          הודעות מוטיבציה
        </Text>
        <MessagesList />
      </Stack>
    </PageContainer>
  );
}
