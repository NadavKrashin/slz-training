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
    <Box style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      <Box
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Sealz pose="waving" size="lg" />
      </Box>
      <Center mih="100dvh" p="md" style={{ position: 'relative', zIndex: 1 }}>
        <Container size="xs" w="100%">
          <PageTransition>
            <Stack gap="xl">{children}</Stack>
          </PageTransition>
        </Container>
      </Center>
    </Box>
  );
}
