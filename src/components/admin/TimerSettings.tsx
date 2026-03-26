'use client';

import { useState, useEffect } from 'react';
import { Stack, Button, Text, Card } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { Timestamp } from 'firebase/firestore';
import { subscribeToAppSettings, updateAppSettings } from '@/lib/firebase/firestore';

export function TimerSettings() {
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAppSettings((settings) => {
      if (settings?.sportDayDueDate) {
        setDueDate(settings.sportDayDueDate.toDate());
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!dueDate) return;
    setSaving(true);
    try {
      await updateAppSettings({ sportDayDueDate: Timestamp.fromDate(dueDate) });
      notifications.show({ title: 'נשמר', message: 'תאריך יום הספורט עודכן', color: 'green' });
    } catch {
      notifications.show({ title: 'שגיאה', message: 'העדכון נכשל', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Text c="dimmed">טוען...</Text>;

  return (
    <Stack gap="md">
      <Card>
        <Stack gap="md">
          <Text fw={600}>תאריך יום הספורט</Text>
          <Text size="sm" c="dimmed">
            הגדר את התאריך שאליו הטיימר סופר אחורה
          </Text>
          <DateTimePicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="בחר תאריך ושעה"
            locale="he"
            clearable
          />
          <Button onClick={handleSave} loading={saving} disabled={!dueDate}>
            שמור
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}
