'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  SegmentedControl,
  Button,
  Text,
  Card,
  Group,
  Badge,
  Divider,
  ThemeIcon,
} from '@mantine/core';
import { IconBell, IconBellRinging, IconUsers, IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { sendCustomPushFn } from '@/lib/firebase/functions';
import { getRecentManualNotificationLogs } from '@/lib/firebase/firestore';
import type { NotificationLog } from '@/lib/firebase/firestore';

const AUDIENCE_OPTIONS = [
  { label: 'כולם', value: 'all' },
  { label: 'לא השלימו היום', value: 'not_completed_today' },
  { label: 'השלימו היום', value: 'completed_today' },
];

const AUDIENCE_LABELS: Record<string, string> = {
  all: 'כולם',
  not_completed_today: 'לא השלימו היום',
  completed_today: 'השלימו היום',
};

function formatTime(ts: { seconds: number } | null | undefined): string {
  if (!ts) return '';
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function PushNotificationForm() {
  const [title, setTitle] = useState('של״ז בכושר 💪');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'all' | 'not_completed_today' | 'completed_today'>('all');
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const data = await getRecentManualNotificationLogs(5);
      setLogs(data);
    } catch {
      // Not critical
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      notifications.show({ message: 'נא למלא כותרת ותוכן', color: 'orange' });
      return;
    }
    setSending(true);
    try {
      const result = await sendCustomPushFn({ title: title.trim(), body: body.trim(), audience });
      const { sentCount, failureCount } = result.data;
      notifications.show({
        title: 'התראה נשלחה',
        message: `נשלח ל-${sentCount} משתמשים${failureCount > 0 ? `, ${failureCount} נכשלו` : ''}`,
        color: sentCount > 0 ? 'green' : 'orange',
      });
      setBody('');
      await loadLogs();
    } catch (err: any) {
      notifications.show({ message: err?.message ?? 'שליחה נכשלה', color: 'red' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Stack gap="md">
      <Group gap="xs">
        <ThemeIcon variant="light" color="brand" size="sm">
          <IconBellRinging size={14} />
        </ThemeIcon>
        <Text fw={600} size="sm">
          שלח התראה
        </Text>
      </Group>

      <TextInput
        label="כותרת"
        placeholder="של״ז בכושר 💪"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <Textarea
        label="תוכן ההודעה"
        placeholder="כתוב את ההודעה כאן..."
        value={body}
        onChange={(e) => setBody(e.currentTarget.value)}
        minRows={3}
        autosize
      />

      <Stack gap={4}>
        <Text size="sm" fw={500}>
          קהל יעד
        </Text>
        <SegmentedControl
          fullWidth
          value={audience}
          onChange={(v) => setAudience(v as typeof audience)}
          data={AUDIENCE_OPTIONS}
          size="xs"
        />
      </Stack>

      <Button
        leftSection={<IconBell size={16} />}
        onClick={handleSend}
        loading={sending}
        disabled={!title.trim() || !body.trim()}
      >
        שלח התראה
      </Button>

      {!logsLoading && logs.length > 0 && (
        <>
          <Divider label="שליחות אחרונות" labelPosition="right" mt="xs" />
          <Stack gap="xs">
            {logs.map((log) => (
              <Card key={log.id} padding="xs" withBorder>
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={600} truncate>
                      {log.title}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {log.body}
                    </Text>
                    <Group gap={4} mt={2}>
                      <Badge size="xs" variant="light" color="gray" leftSection={<IconUsers size={10} />}>
                        {AUDIENCE_LABELS[log.audience ?? 'all']}
                      </Badge>
                      <Badge size="xs" variant="light" color="green" leftSection={<IconCheck size={10} />}>
                        {log.successCount}
                      </Badge>
                      {log.failureCount > 0 && (
                        <Badge size="xs" variant="light" color="red" leftSection={<IconX size={10} />}>
                          {log.failureCount}
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                  <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                    {formatTime(log.sentAt as any)}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}
