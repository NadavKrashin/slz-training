'use client';

import { Text, Stack, ThemeIcon } from '@mantine/core';
import { IconBarbell } from '@tabler/icons-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Stack gap="lg">
      <Stack gap="sm" align="center">
        <ThemeIcon size={56} radius="xl" variant="light" color="brand">
          <IconBarbell size={28} />
        </ThemeIcon>
        <Text size="2rem" fw={700}>
          של״ז בכושר
        </Text>
        <Text c="dimmed">צור חשבון חדש</Text>
      </Stack>
      <RegisterForm />
    </Stack>
  );
}
