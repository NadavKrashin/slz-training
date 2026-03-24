'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingState } from '@/components/ui/LoadingState';
import { NAV_HEIGHT } from '@/lib/constants';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const hideNav = pathname === '/workout';

  return (
    <>
      <Box pb={hideNav ? 0 : NAV_HEIGHT}>{children}</Box>
      {!hideNav && <BottomNav />}
    </>
  );
}
