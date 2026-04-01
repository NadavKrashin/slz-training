'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Container, Stack } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageTransition } from '@/components/ui/PageTransition';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (user) return null;

  return (
    <Center mih="100dvh" p="md">
      <Container size="xs" w="100%">
        <PageTransition>
          <Stack gap="xl">{children}</Stack>
        </PageTransition>
      </Container>
    </Center>
  );
}
