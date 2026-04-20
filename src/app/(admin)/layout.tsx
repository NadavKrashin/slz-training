'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
import { NAV_HEIGHT } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { AdminNav } from '@/components/layout/AdminNav';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageTransition } from '@/components/ui/PageTransition';

const ADMIN_PATHS = ['/admin', '/admin/workouts', '/admin/users', '/admin/messages', '/admin/timer'];
const SWIPE_MIN_X = 60;
const SWIPE_EDGE_GUARD = 30;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

    // Find current top-level admin tab
    const currentIndex = ADMIN_PATHS.findIndex((p) =>
      p === '/admin' ? pathname === '/admin' : pathname.startsWith(p)
    );
    if (currentIndex === -1) return;

    if (dx > 0) {
      // Swipe right → next admin tab
      const nextIndex = currentIndex + 1;
      if (nextIndex < ADMIN_PATHS.length) router.push(ADMIN_PATHS[nextIndex]);
    } else {
      // Swipe left → previous admin tab, or exit to app if on first tab
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        router.push(ADMIN_PATHS[prevIndex]);
      } else {
        router.push('/home');
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/home');
  }, [user, loading, isAdmin, router]);

  if (loading) return <LoadingState />;
  if (!user || !isAdmin) return null;

  return (
    <Box onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Box pt="md" pb={NAV_HEIGHT + 16} px="md" mih="100dvh">
        <PageTransition key={pathname}>{children}</PageTransition>
      </Box>
      <AdminNav />
    </Box>
  );
}
