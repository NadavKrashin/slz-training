'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { AdminNav } from '@/components/layout/AdminNav';
import { LoadingState } from '@/components/ui/LoadingState';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/home');
  }, [user, loading, isAdmin, router]);

  if (loading) return <LoadingState />;
  if (!user || !isAdmin) return null;

  return (
    <>
      <AdminNav />
      <Box>{children}</Box>
    </>
  );
}
