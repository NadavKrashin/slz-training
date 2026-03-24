'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Stack, Text, Anchor, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';

export function RegisterForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { displayName: '', email: '', password: '', confirmPassword: '' },
    validate: {
      displayName: (v) => (v.length < 2 ? 'נדרש שם תצוגה' : null),
      email: (v) => (!v.includes('@') ? 'אימייל לא תקין' : null),
      password: (v) => (v.length < 6 ? 'סיסמה חייבת להיות לפחות 6 תווים' : null),
      confirmPassword: (v, values) => (v !== values.password ? 'הסיסמאות לא תואמות' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError('');
    setLoading(true);
    try { await signUp(values.email, values.password, values.displayName); router.push('/home'); }
    catch (e: any) {
      setError(e?.code === 'auth/email-already-in-use' ? 'אימייל כבר קיים במערכת' : 'שגיאה בהרשמה, נסה שוב');
    }
    finally { setLoading(false); }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">{error}</Alert>}
        <TextInput label="שם תצוגה" placeholder="השם שלך" {...form.getInputProps('displayName')} />
        <TextInput label="אימייל" placeholder="your@email.com" type="email" {...form.getInputProps('email')} />
        <PasswordInput label="סיסמה" placeholder="לפחות 6 תווים" {...form.getInputProps('password')} />
        <PasswordInput label="אימות סיסמה" placeholder="הכנס סיסמה שוב" {...form.getInputProps('confirmPassword')} />
        <Button type="submit" fullWidth loading={loading} size="md">הרשמה</Button>
        <GoogleSignInButton />
        <Text size="sm" ta="center">כבר יש לך חשבון? <Anchor href="/login" fw={600}>התחברות</Anchor></Text>
      </Stack>
    </form>
  );
}
