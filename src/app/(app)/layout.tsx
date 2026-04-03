'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { AppDataProvider, useAppData } from '@/contexts/AppDataContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageTransition } from '@/components/ui/PageTransition';
import { NAV_HEIGHT } from '@/lib/constants';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const NAV_PATHS = ['/home', '/history', '/timer', '/profile'];
const NAV_PATHS_ADMIN = ['/home', '/history', '/timer', '/profile', '/admin'];
const SWIPE_MIN_X = 60;   // minimum horizontal distance to count as a swipe
const SWIPE_EDGE_GUARD = 30; // ignore swipes starting within this many px of screen edge
const STALE_RELOAD_MS = 30 * 60 * 1000; // reload after 30 min in background

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

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const { loading: dataLoading } = useAppData();
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const hiddenAt = useRef<number | null>(null);

  // Reload after 30 min in background so iOS PWA always picks up latest code.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
      } else if (
        document.visibilityState === 'visible' &&
        hiddenAt.current !== null &&
        Date.now() - hiddenAt.current > STALE_RELOAD_MS
      ) {
        window.location.reload();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    if (x < SWIPE_EDGE_GUARD || x > window.innerWidth - SWIPE_EDGE_GUARD) return;
    touchStartX.current = x;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < SWIPE_MIN_X) return;

    const paths = isAdmin ? NAV_PATHS_ADMIN : NAV_PATHS;
    const currentIndex = paths.findIndex((p) => pathname.startsWith(p));
    if (currentIndex === -1) return;

    const nextIndex = dx > 0 ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= paths.length) return;
    router.push(paths[nextIndex]);
  }, [pathname, router, isAdmin]);

  if (dataLoading) return <LoadingState />;

  const hideNav = pathname === '/workout';

  return (
    <Box
      onTouchStart={hideNav ? undefined : handleTouchStart}
      onTouchEnd={hideNav ? undefined : handleTouchEnd}
    >
      <Box pb={hideNav ? 0 : NAV_HEIGHT}>
        <PageTransition key={pathname}>{children}</PageTransition>
      </Box>
      {!hideNav && <BottomNav />}
    </Box>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  return (
    <AppDataProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AppDataProvider>
  );
}
