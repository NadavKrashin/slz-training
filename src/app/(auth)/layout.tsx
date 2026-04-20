'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Container, Stack, Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageTransition } from '@/components/ui/PageTransition';
import { Sealz } from '@/components/ui/Sealz';

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
        <Stack gap="sm" align="center">
          <Sealz pose="waving" size="lg" />
          <PageTransition>
            <Stack gap="xl">{children}</Stack>
          </PageTransition>
        </Stack>
      </Container>
    </Center>
  );
}
