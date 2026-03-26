'use client';

import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { UsersList } from '@/components/admin/UsersList';

export default function UsersPage() {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">
          משתמשים
        </Text>
        <UsersList />
      </Stack>
    </PageContainer>
  );
}
