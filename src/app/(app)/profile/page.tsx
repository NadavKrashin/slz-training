'use client';

import { useState } from 'react';
import { Stack, Text, TextInput, Button, Switch, Card, Group, Box, Container, ThemeIcon } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { useStreak } from '@/hooks/useStreak';
import { requestNotificationPermission } from '@/lib/firebase/messaging';
import { NAV_HEIGHT } from '@/lib/constants';

export default function ProfilePage() {
  const { user, signOut, updateDisplayName, isAdmin } = useAuth();
  const { userData, updateProfile } = useUser();
  const { currentStreak } = useStreak();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateDisplayName(name.trim());
      await updateProfile({ displayName: name.trim() });
      setName('');
      notifications.show({ title: 'עודכן', message: 'השם עודכן בהצלחה', color: 'green' });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'העדכון נכשל', color: 'red' });
    } finally { setSaving(false); }
  };

  const handleToggleShare = async () => {
    if (!userData) return;
    try {
      await updateProfile({ shareCompletionWithAdmin: !userData.shareCompletionWithAdmin });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'העדכון נכשל', color: 'red' });
    }
  };

  const handleNotifications = async () => {
    if (!user) return;
    const granted = await requestNotificationPermission(user.uid);
    setNotifPermission(Notification.permission);
    if (granted) {
      notifications.show({ title: 'הופעלו', message: 'התראות הופעלו בהצלחה', color: 'green' });
    } else {
      notifications.show({ title: 'נכשל', message: 'לא ניתן להפעיל התראות', color: 'red' });
    }
  };

  return (
    <Box pb={NAV_HEIGHT + 24}>
      {/* Compact profile header */}
      <Box
        style={{
          background: 'linear-gradient(160deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
          borderRadius: '0 0 24px 24px',
        }}
        px="md"
        pt={36}
        pb={28}
      >
        <Container size="sm">
          <Group justify="center" gap="md">
            <ThemeIcon size={48} radius="xl" color="white" variant="filled" c="brand.6">
              <IconUser size={24} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="md" fw={700} c="white">{userData?.displayName}</Text>
              <Text size="xs" c="rgba(255,255,255,0.7)">{userData?.email}</Text>
            </Stack>
            {isAdmin && (
              <Box px="sm" py={2} style={{ borderRadius: 'var(--mantine-radius-xl)', background: 'rgba(255,255,255,0.2)' }}>
                <Text size="xs" fw={600} c="white">מנהל</Text>
              </Box>
            )}
          </Group>
        </Container>
      </Box>

      <Container size="sm" px="md" pt="lg">
        <Stack gap="md">
          <Card>
            <Group justify="center" gap="xs">
              <Text size="sm">רצף אימונים:</Text>
              <Text size="lg" fw={700} c="orange.6">🔥 {currentStreak} ימים</Text>
            </Group>
          </Card>

          <Card>
            <Stack gap="sm">
              <Text fw={500} c="brand.7">עדכון שם תצוגה</Text>
              <Group>
                <TextInput placeholder={userData?.displayName} value={name} onChange={(e) => setName(e.currentTarget.value)} style={{ flex: 1 }} />
                <Button onClick={handleUpdateName} loading={saving} disabled={!name.trim()}>עדכן</Button>
              </Group>
            </Stack>
          </Card>

          <Card>
            <Switch
              label="שתף ביצוע אימונים עם המנהל"
              checked={userData?.shareCompletionWithAdmin ?? true}
              onChange={handleToggleShare}
            />
          </Card>

          {notifPermission !== 'granted' && (
            <Button variant="light" onClick={handleNotifications}>הפעל התראות</Button>
          )}
          <Button variant="subtle" color="red" onClick={signOut}>התנתק</Button>
        </Stack>
      </Container>
    </Box>
  );
}
