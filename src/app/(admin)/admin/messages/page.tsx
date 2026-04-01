'use client';

import { Stack, Text, Divider } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { PushNotificationForm } from '@/components/admin/PushNotificationForm';
import { MessagesList } from '@/components/admin/MessagesList';

export default function MessagesPage() {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">
          הודעות
        </Text>
        <PushNotificationForm />
        <Divider label="הודעות מוטיבציה" labelPosition="right" />
        <MessagesList />
      </Stack>
    </PageContainer>
  );
}
