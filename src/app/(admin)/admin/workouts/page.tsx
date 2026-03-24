'use client';

import { useState, useEffect } from 'react';
import { Stack, Text, Button, Group, Card, Badge, ActionIcon } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getWorkoutsInRange, deleteWorkout } from '@/lib/firebase/firestore';
import { getTodayDateKey, getHebrewDate, formatDateKey, dateKeyToDate } from '@/lib/dates';
import { notifications } from '@mantine/notifications';
import type { Workout } from '@/lib/types';

export default function WorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const loadWorkouts = async () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    const end = new Date(today);
    end.setDate(end.getDate() + 30);
    const startKey = formatDateKey(start);
    const endKey = formatDateKey(end);
    const w = await getWorkoutsInRange(startKey, endKey);
    setWorkouts(w);
    setLoading(false);
  };

  useEffect(() => { loadWorkouts(); }, []);

  const todayKey = getTodayDateKey();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteWorkout(deleteTarget);
      notifications.show({ title: 'נמחק', message: 'האימון נמחק', color: 'green' });
      setDeleteTarget(null);
      loadWorkouts();
    } catch {
      notifications.show({ title: 'שגיאה', message: 'המחיקה נכשלה', color: 'red' });
    }
  };

  return (
    <PageContainer>
      <Stack gap="lg">
        <Group justify="space-between">
          <Text size="xl" fw={700}>אימונים</Text>
          <Button leftSection={<IconPlus size={16} />} onClick={() => router.push(`/admin/workouts/${todayKey}`)}>אימון חדש</Button>
        </Group>
        {loading && <Text c="dimmed">טוען...</Text>}
        {!loading && workouts.length === 0 && <Text c="dimmed" ta="center">אין אימונים</Text>}
        {workouts.map((w) => (
          <Card key={w.dateKey} padding="md" withBorder>
            <Group justify="space-between">
              <Stack gap={4}>
                <Group gap="xs">
                  <Text fw={500}>{w.title}</Text>
                  {w.dateKey === todayKey && <Badge size="sm" color="green">היום</Badge>}
                </Group>
                <Text size="sm" c="dimmed">{getHebrewDate(dateKeyToDate(w.dateKey))}</Text>
                <Text size="xs" c="dimmed">{w.stages.length} תחנות</Text>
              </Stack>
              <Group gap="xs">
                <ActionIcon variant="subtle" aria-label="ערוך אימון" onClick={() => router.push(`/admin/workouts/${w.dateKey}`)}><IconEdit size={16} /></ActionIcon>
                <ActionIcon variant="subtle" color="red" aria-label="מחק אימון" onClick={() => setDeleteTarget(w.dateKey)}><IconTrash size={16} /></ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
      <ConfirmModal
        opened={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="מחיקת אימון"
        message="למחוק את האימון? לא ניתן לבטל פעולה זו."
      />
    </PageContainer>
  );
}
