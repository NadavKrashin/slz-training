'use client';

import { useState } from 'react';
import { Stack, Text, TextInput, Button, Switch, Card, Group, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { useStreak } from '@/hooks/useStreak';
import { requestNotificationPermission } from '@/lib/firebase/messaging';

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
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">פרופיל</Text>

        <Card>
          <Stack gap="sm">
            <Text fw={500}>{userData?.displayName}</Text>
            <Text size="sm" c="dimmed">{userData?.email}</Text>
            {isAdmin && <Text size="sm" c="brand">מנהל</Text>}
            <Divider />
            <Group>
              <Text size="sm">רצף אימונים:</Text>
              <Text size="sm" fw={700}>{currentStreak} ימים 🔥</Text>
            </Group>
          </Stack>
        </Card>

        <Card>
          <Stack gap="sm">
            <Text fw={500}>עדכון שם תצוגה</Text>
            <Group>
              <TextInput placeholder={userData?.displayName} value={name} onChange={(e) => setName(e.currentTarget.value)} style={{ flex: 1 }} />
              <Button onClick={handleUpdateName} loading={saving} disabled={!name.trim()}>עדכן</Button>
            </Group>
          </Stack>
        </Card>

        <Card>
          <Stack gap="sm">
            <Switch
              label="שתף ביצוע אימונים עם המנהל"
              checked={userData?.shareCompletionWithAdmin ?? true}
              onChange={handleToggleShare}
            />
          </Stack>
        </Card>

        {notifPermission !== 'granted' && (
          <Button variant="outline" onClick={handleNotifications}>הפעל התראות</Button>
        )}
        <Button variant="light" color="red" onClick={signOut}>התנתק</Button>
      </Stack>
    </PageContainer>
  );
}
