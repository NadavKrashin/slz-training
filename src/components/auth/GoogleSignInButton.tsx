'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try { await signInWithGoogle(); router.push('/home'); }
    catch { /* cancelled */ }
    finally { setLoading(false); }
  };

  return (
    <Button variant="default" fullWidth size="md" leftSection={<IconBrandGoogle size={20} />} onClick={handleClick} loading={loading}>
      התחברות עם Google
    </Button>
  );
}
