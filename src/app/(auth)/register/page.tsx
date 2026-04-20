'use client';

import { Text, Stack } from '@mantine/core';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Stack gap="lg">
      <Stack gap="sm" align="center">
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">צור חשבון חדש</Text>
      </Stack>
      <RegisterForm />
    </Stack>
  );
}
