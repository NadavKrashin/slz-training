'use client';

import { useState } from 'react';
import {
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Switch,
  Card,
  Group,
  Box,
  Container,
  ThemeIcon,
  Alert,
} from '@mantine/core';
import { IconUser, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { useStreak } from '@/hooks/useStreak';
import { requestNotificationPermission } from '@/lib/firebase/messaging';
import { hasNotificationAPI, getNotificationPermission } from '@/lib/browser';
import { NAV_HEIGHT } from '@/lib/constants';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function ProfilePage() {
  const {
    user,
    signOut,
    updateDisplayName,
    isAdmin,
    isGuest,
    linkGuestToEmail,
    linkGuestToGoogle,
  } = useAuth();
  const { userData, updateProfile } = useUser();
  const { currentStreak } = useStreak();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    getNotificationPermission
  );

  // Guest upgrade state
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [upgradePassword, setUpgradePassword] = useState('');
  const [upgradeDisplayName, setUpgradeDisplayName] = useState('');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

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
    } finally {
      setSaving(false);
    }
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
    setNotifPermission(getNotificationPermission());
    if (granted) {
      notifications.show({ title: 'הופעלו', message: 'התראות הופעלו בהצלחה', color: 'green' });
    } else {
      notifications.show({ title: 'נכשל', message: 'לא ניתן להפעיל התראות', color: 'red' });
    }
  };

  const handleUpgradeWithEmail = async () => {
    if (!upgradeEmail.trim() || !upgradePassword || !upgradeDisplayName.trim()) return;
    setUpgradeLoading(true);
    setUpgradeError('');
    try {
      await linkGuestToEmail(upgradeEmail.trim(), upgradePassword, upgradeDisplayName.trim());
      notifications.show({ title: 'שודרג', message: 'החשבון שודרג בהצלחה!', color: 'green' });
    } catch {
      setUpgradeError('שדרוג החשבון נכשל. ייתכן שהאימייל כבר בשימוש.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleUpgradeWithGoogle = async () => {
    try {
      await linkGuestToGoogle();
      notifications.show({ title: 'שודרג', message: 'החשבון שודרג בהצלחה!', color: 'green' });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'שדרוג עם Google נכשל', color: 'red' });
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
              <Text size="md" fw={700} c="white">
                {isGuest ? 'אורח' : userData?.displayName}
              </Text>
              {!isGuest && (
                <Text size="xs" c="rgba(255,255,255,0.7)">
                  {userData?.email}
                </Text>
              )}
            </Stack>
            {isAdmin && (
              <Box
                px="sm"
                py={2}
                style={{
                  borderRadius: 'var(--mantine-radius-xl)',
                  background: 'rgba(255,255,255,0.2)',
                }}
              >
                <Text size="xs" fw={600} c="white">
                  מנהל
                </Text>
              </Box>
            )}
            {isGuest && (
              <Box
                px="sm"
                py={2}
                style={{
                  borderRadius: 'var(--mantine-radius-xl)',
                  background: 'rgba(255,200,0,0.3)',
                }}
              >
                <Text size="xs" fw={600} c="white">
                  אורח
                </Text>
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
              <Text size="lg" fw={700} c="orange.6">
                🔥 {currentStreak} ימים
              </Text>
            </Group>
          </Card>

          {isGuest ? (
            /* Guest upgrade section */
            <>
              <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
                אתה מחובר כאורח. צור חשבון כדי לשמור את ההתקדמות שלך לצמיתות.
              </Alert>

              <Card>
                <Stack gap="sm">
                  <Text fw={600} c="brand.7">
                    שדרג לחשבון מלא
                  </Text>
                  {upgradeError && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                      {upgradeError}
                    </Alert>
                  )}
                  <TextInput
                    label="שם תצוגה"
                    placeholder="הכנס שם"
                    value={upgradeDisplayName}
                    onChange={(e) => setUpgradeDisplayName(e.currentTarget.value)}
                  />
                  <TextInput
                    label="אימייל"
                    placeholder="your@email.com"
                    type="email"
                    value={upgradeEmail}
                    onChange={(e) => setUpgradeEmail(e.currentTarget.value)}
                  />
                  <PasswordInput
                    label="סיסמה"
                    placeholder="הכנס סיסמה"
                    value={upgradePassword}
                    onChange={(e) => setUpgradePassword(e.currentTarget.value)}
                  />
                  <Button
                    onClick={handleUpgradeWithEmail}
                    loading={upgradeLoading}
                    disabled={
                      !upgradeEmail.trim() || !upgradePassword || !upgradeDisplayName.trim()
                    }
                  >
                    שדרג חשבון
                  </Button>
                  <GoogleSignInButton onClick={handleUpgradeWithGoogle} />
                </Stack>
              </Card>

              <Button variant="subtle" color="red" onClick={signOut}>
                התנתק
              </Button>
            </>
          ) : (
            /* Regular user profile */
            <>
              <Card>
                <Stack gap="sm">
                  <Text fw={500} c="brand.7">
                    עדכון שם תצוגה
                  </Text>
                  <Group>
                    <TextInput
                      placeholder={userData?.displayName}
                      value={name}
                      onChange={(e) => setName(e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleUpdateName} loading={saving} disabled={!name.trim()}>
                      עדכן
                    </Button>
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

              {hasNotificationAPI && notifPermission !== 'granted' && (
                <Button variant="light" onClick={handleNotifications}>
                  הפעל התראות
                </Button>
              )}
              <Button variant="subtle" color="red" onClick={signOut}>
                התנתק
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
