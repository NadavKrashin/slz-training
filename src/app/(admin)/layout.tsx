'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { NAV_HEIGHT } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { AdminNav } from '@/components/layout/AdminNav';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageTransition } from '@/components/ui/PageTransition';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/home');
  }, [user, loading, isAdmin, router]);

  if (loading) return <LoadingState />;
  if (!user || !isAdmin) return null;

  return (
    <>
      <Box pt="md" pb={NAV_HEIGHT + 16} px="md" mih="100dvh">
        <PageTransition key={pathname}>{children}</PageTransition>
      </Box>
      <AdminNav />
    </>
  );
}
