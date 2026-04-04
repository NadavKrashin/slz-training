'use client';

import { Text, Stack } from '@mantine/core';
import { SealzStacked } from '@/components/ui/Sealz';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Stack gap="lg">
      <Stack gap="sm" align="center">
        <SealzStacked pose="waving" size="xl" />
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">התחבר כדי להתחיל להתאמן</Text>
      </Stack>
      <LoginForm />
    </Stack>
  );
}
