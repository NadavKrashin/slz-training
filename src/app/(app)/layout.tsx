'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingState } from '@/components/ui/LoadingState';
import { NAV_HEIGHT } from '@/lib/constants';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

declare global {
  interface Window {
    makeAdmin?: (targetUid: string) => Promise<void>;
    whoAmI?: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.whoAmI = () => {
    const user = getAuth().currentUser;
    console.log('email:', user?.email);
    console.log('uid:', user?.uid);
  };

  window.makeAdmin = async (targetUid: string) => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('No signed-in user');

    const callable = httpsCallable(getFunctions(), 'setAdminClaim');
    const result = await callable({ targetUid });
    console.log(result.data);
  };
}

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
