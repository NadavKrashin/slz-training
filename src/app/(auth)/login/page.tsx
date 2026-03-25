'use client';

import { Text, Stack } from '@mantine/core';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Stack gap="lg">
      <Stack gap={4} align="center">
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">התחבר כדי להתחיל להתאמן</Text>
      </Stack>
      <LoginForm />
    </Stack>
  );
}
