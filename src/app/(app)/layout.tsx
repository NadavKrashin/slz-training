'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    // Ignore swipes that start near the screen edge (iOS back/forward gesture zone)
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

    // Ignore if vertical movement dominates (user is scrolling)
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < SWIPE_MIN_X) return;

    const paths = isAdmin ? NAV_PATHS_ADMIN : NAV_PATHS;
    const currentIndex = paths.findIndex((p) => pathname.startsWith(p));
    if (currentIndex === -1) return;

    // Swipe right → next tab, swipe left → previous tab
    const nextIndex = dx > 0 ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= paths.length) return;
    router.push(paths[nextIndex]);
  }, [pathname, router, isAdmin]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

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
