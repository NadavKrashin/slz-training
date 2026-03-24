'use client';

import { useEffect, useState } from 'react';
import { Stack, Group, TextInput, Button, ActionIcon, Switch, Text, Card } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getAllMessages, saveMessage, deleteMessage } from '@/lib/firebase/firestore';
import type { MotivationalMessage } from '@/lib/types';

export function MessagesList() {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);

  const loadMessages = async () => {
    const msgs = await getAllMessages();
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    try {
      await saveMessage(null, newText.trim(), true);
      setNewText('');
      await loadMessages();
      notifications.show({ title: 'נוסף', message: 'ההודעה נוספה', color: 'green' });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'ההוספה נכשלה', color: 'red' });
    } finally { setSaving(false); }
  };

  const handleToggle = async (msg: MotivationalMessage) => {
    try {
      await saveMessage(msg.id, msg.text, !msg.active);
      await loadMessages();
    } catch {
      notifications.show({ title: 'שגיאה', message: 'העדכון נכשל', color: 'red' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      await loadMessages();
      notifications.show({ title: 'נמחק', message: 'ההודעה נמחקה', color: 'green' });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'המחיקה נכשלה', color: 'red' });
    }
  };

  if (loading) return <Text c="dimmed">טוען הודעות...</Text>;

  return (
    <Stack gap="md">
      <Group>
        <TextInput placeholder="הודעה מוטיבציונית חדשה..." value={newText} onChange={(e) => setNewText(e.currentTarget.value)} style={{ flex: 1 }} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
        <Button leftSection={<IconPlus size={16} />} onClick={handleAdd} loading={saving}>הוסף</Button>
      </Group>
      {messages.map((msg) => (
        <Card key={msg.id} padding="sm" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <Text size="sm" style={{ flex: 1 }}>{msg.text}</Text>
            <Group gap="xs" wrap="nowrap">
              <Switch checked={msg.active} onChange={() => handleToggle(msg)} label={msg.active ? 'פעיל' : 'כבוי'} size="sm" />
              <ActionIcon variant="subtle" color="red" aria-label="מחק הודעה" onClick={() => handleDelete(msg.id)}><IconTrash size={16} /></ActionIcon>
            </Group>
          </Group>
        </Card>
      ))}
      {messages.length === 0 && <Text c="dimmed" ta="center">אין הודעות</Text>}
    </Stack>
  );
}
