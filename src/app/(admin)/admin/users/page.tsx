'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { UsersList } from '@/components/admin/UsersList';
import { UserDetailClient } from './[uid]/UserDetailClient';

function UsersPageInner() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  if (uid) {
    return <UserDetailClient />;
  }

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

export default function UsersPage() {
  return (
    <Suspense>
      <UsersPageInner />
    </Suspense>
  );
}
