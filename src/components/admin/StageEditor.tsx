'use client';

import { Stack, Group, TextInput, NumberInput, Select, ActionIcon, Button, Text, Alert } from '@mantine/core';
import { IconTrash, IconPlus, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { nanoid } from 'nanoid';
import { WORKOUT_DURATION_SECONDS } from '@/lib/constants';
import type { WorkoutStage } from '@/lib/types';

interface StageEditorProps { stages: WorkoutStage[]; onChange: (stages: WorkoutStage[]) => void; }

export function StageEditor({ stages, onChange }: StageEditorProps) {
  const totalDuration = stages.reduce((sum, s) => sum + s.durationSeconds, 0);
  const isValid = totalDuration === WORKOUT_DURATION_SECONDS;

  const addStage = () => {
    onChange([...stages, { id: nanoid(), name: '', type: 'exercise', durationSeconds: 30, order: stages.length }]);
  };

  const removeStage = (index: number) => {
    onChange(stages.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  };

  const updateStage = (index: number, updates: Partial<WorkoutStage>) => {
    onChange(stages.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  };

  const moveStage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stages.length) return;
    const newStages = [...stages];
    [newStages[index], newStages[newIndex]] = [newStages[newIndex], newStages[index]];
    onChange(newStages.map((s, i) => ({ ...s, order: i })));
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={600}>שלבים</Text>
        <Text fw={700} size="sm" c={isValid ? 'green' : 'red'}>{totalDuration} / {WORKOUT_DURATION_SECONDS} שניות</Text>
      </Group>
      {!isValid && totalDuration > 0 && (
        <Alert color="red" variant="light">סך כל זמן השלבים חייב להיות בדיוק {WORKOUT_DURATION_SECONDS} שניות ({WORKOUT_DURATION_SECONDS / 60} דקות)</Alert>
      )}
      {stages.map((stage, index) => (
        <Group key={stage.id} gap="xs" align="flex-end" wrap="wrap">
          <Stack gap={2}>
            <ActionIcon variant="subtle" size="sm" aria-label="הזז למעלה" onClick={() => moveStage(index, -1)} disabled={index === 0}><IconArrowUp size={14} /></ActionIcon>
            <ActionIcon variant="subtle" size="sm" aria-label="הזז למטה" onClick={() => moveStage(index, 1)} disabled={index === stages.length - 1}><IconArrowDown size={14} /></ActionIcon>
          </Stack>
          <Text size="sm" c="dimmed" w={20} ta="center">{index + 1}</Text>
          <TextInput placeholder="שם השלב" value={stage.name} onChange={(e) => updateStage(index, { name: e.currentTarget.value })} style={{ flex: 1, minWidth: 120 }} />
          <Select data={[{ value: 'exercise', label: 'תרגיל' }, { value: 'rest', label: 'מנוחה' }]} value={stage.type} onChange={(v) => updateStage(index, { type: v as 'exercise' | 'rest' })} w={100} />
          <NumberInput placeholder="שניות" value={stage.durationSeconds} onChange={(v) => updateStage(index, { durationSeconds: Number(v) || 0 })} min={1} max={600} w={80} suffix=" ש׳" />
          <ActionIcon variant="subtle" color="red" aria-label="מחק שלב" onClick={() => removeStage(index)}><IconTrash size={16} /></ActionIcon>
        </Group>
      ))}
      <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addStage}>הוסף שלב</Button>
    </Stack>
  );
}
