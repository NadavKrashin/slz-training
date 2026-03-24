'use client';

import { useState } from 'react';
import { TextInput, Button, Stack, Text, Anchor, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: '' },
    validate: { email: (v) => (!v.includes('@') ? 'אימייל לא תקין' : null) },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError('');
    setLoading(true);
    try { await resetPassword(values.email); setSuccess(true); }
    catch { setError('שגיאה בשליחת מייל איפוס'); }
    finally { setLoading(false); }
  });

  if (success) {
    return (
      <Stack gap="md" align="center">
        <Alert icon={<IconCheck size={16} />} color="green" variant="light">נשלח מייל איפוס סיסמה! בדוק את תיבת הדואר שלך.</Alert>
        <Anchor href="/login" fw={600}>חזרה להתחברות</Anchor>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">{error}</Alert>}
        <Text size="sm" c="dimmed">הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.</Text>
        <TextInput label="אימייל" placeholder="your@email.com" type="email" {...form.getInputProps('email')} />
        <Button type="submit" fullWidth loading={loading} size="md">שלח קישור איפוס</Button>
        <Text size="sm" ta="center"><Anchor href="/login">חזרה להתחברות</Anchor></Text>
      </Stack>
    </form>
  );
}
