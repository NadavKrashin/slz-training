'use client';

import { Text, Stack } from '@mantine/core';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Stack gap="lg">
      <Stack gap={4} align="center">
        <Text size="2rem" fw={700}>של״ז בכושר</Text>
        <Text c="dimmed">שחזור סיסמה</Text>
      </Stack>
      <ForgotPasswordForm />
    </Stack>
  );
}
