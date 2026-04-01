'use client';

import { Text, Stack, ThemeIcon } from '@mantine/core';
import { IconBarbell } from '@tabler/icons-react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Stack gap="lg">
      <Stack gap="sm" align="center">
        <ThemeIcon size={56} radius="xl" variant="light" color="brand">
          <IconBarbell size={28} />
        </ThemeIcon>
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">שחזור סיסמה</Text>
      </Stack>
      <ForgotPasswordForm />
    </Stack>
  );
}
