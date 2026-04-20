'use client';

import { useState, useEffect } from 'react';
import { Stack, TextInput, Textarea, Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { nanoid } from 'nanoid';
import { saveWorkout, getWorkout } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { StageEditor } from './StageEditor';
import type { WorkoutStage, Workout } from '@/lib/types';

interface WorkoutFormProps {
  dateKey: string;
  onSaved?: () => void;
  duplicateFrom?: Workout | null;
}

export function WorkoutForm({ dateKey, onSaved, duplicateFrom }: WorkoutFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stages, setStages] = useState<WorkoutStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (duplicateFrom) {
      setTitle(duplicateFrom.title);
      setDescription(duplicateFrom.description || '');
      setStages(duplicateFrom.stages.map((s) => ({ ...s, id: nanoid() })));
      setInitialLoading(false);
      return;
    }
    getWorkout(dateKey).then((w) => {
      if (w) {
        setTitle(w.title);
        setDescription(w.description || '');
        setStages(w.stages);
      }
      setInitialLoading(false);
    });
  }, [dateKey, duplicateFrom]);

  const totalDuration = stages.reduce((sum, s) => sum + s.durationSeconds, 0);
  const isValid = title.trim().length > 0 && totalDuration > 0;

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      await saveWorkout(dateKey, {
        dateKey,
        title: title.trim(),
        description: description.trim() || undefined,
        stages,
        totalDurationSeconds: totalDuration,
        createdBy: user.uid,
      });
      notifications.show({ title: 'נשמר', message: 'האימון נשמר בהצלחה', color: 'green' });
      onSaved?.();
    } catch {
      notifications.show({ title: 'שגיאה', message: 'שמירת האימון נכשלה', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Text c="dimmed">טוען...</Text>;

  return (
    <Stack gap="lg">
      <TextInput
        label="כותרת האימון"
        placeholder="למשל: אימון כוח עליון"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
      />
      <Textarea
        label="תיאור (אופציונלי)"
        placeholder="הסבר קצר על האימון"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        rows={2}
      />
      <StageEditor stages={stages} onChange={setStages} />
      <Group justify="flex-end">
        <Button onClick={handleSubmit} loading={loading} disabled={!isValid}>
          שמור אימון
        </Button>
      </Group>
    </Stack>
  );
}
