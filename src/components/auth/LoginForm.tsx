'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack, Text, Anchor, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';

export function LoginForm() {
  const { signIn, signInAsGuest } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (!v ? 'נדרש אימייל' : null),
      password: (v) => (!v ? 'נדרשת סיסמה' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError('');
    setLoading(true);
    try {
      await signIn(values.email, values.password);
    } catch {
      setError('אימייל או סיסמה שגויים');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {error}
          </Alert>
        )}
        <TextInput
          label="אימייל"
          placeholder="your@email.com"
          type="email"
          {...form.getInputProps('email')}
        />
        <PasswordInput label="סיסמה" placeholder="הכנס סיסמה" {...form.getInputProps('password')} />
        <Button type="submit" fullWidth loading={loading} size="md">
          התחברות
        </Button>
        <GoogleSignInButton />
        <Button
          variant="light"
          color="gray"
          fullWidth
          size="md"
          loading={guestLoading}
          onClick={async () => {
            setGuestLoading(true);
            try {
              await signInAsGuest();
            } catch {
              setError('כניסה כאורח נכשלה');
            } finally {
              setGuestLoading(false);
            }
          }}
        >
          כניסה כאורח
        </Button>
        <Text size="sm" ta="center">
          אין לך חשבון?{' '}
          <Anchor href="/register" fw={600}>
            הרשמה
          </Anchor>
        </Text>
        <Text size="sm" ta="center">
          <Anchor href="/forgot-password">שכחתי סיסמה</Anchor>
        </Text>
      </Stack>
    </form>
  );
}
