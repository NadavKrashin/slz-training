'use client';

import { Text, Stack, ThemeIcon } from '@mantine/core';
import { IconBarbell } from '@tabler/icons-react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Stack gap="lg">
      <Stack gap="sm" align="center">
        <ThemeIcon size={56} radius="xl" variant="light" color="brand">
          <IconBarbell size={28} />
        </ThemeIcon>
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">התחבר כדי להתחיל להתאמן</Text>
      </Stack>
      <LoginForm />
    </Stack>
  );
}
