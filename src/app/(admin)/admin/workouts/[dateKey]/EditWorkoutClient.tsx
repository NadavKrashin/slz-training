'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Stack, Text, Group, ActionIcon, TextInput } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { WorkoutForm } from '@/components/admin/WorkoutForm';
import { getHebrewDate, dateKeyToDate } from '@/lib/dates';

export function EditWorkoutClient() {
  const params = useParams();
  const router = useRouter();
  const dateKey = params.dateKey as string;
  const [overrideDateKey, setOverrideDateKey] = useState(dateKey);

  const getDescription = () => {
    try { return getHebrewDate(dateKeyToDate(overrideDateKey)); } catch { return ''; }
  };

  return (
    <PageContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon variant="subtle" aria-label="חזרה לרשימת אימונים" onClick={() => router.push('/admin/workouts')}><IconChevronRight size={20} /></ActionIcon>
          <Text size="xl" fw={700}>עריכת אימון</Text>
        </Group>
        <TextInput
          label="מפתח תאריך (YYYY-MM-DD)"
          value={overrideDateKey}
          onChange={(e) => setOverrideDateKey(e.currentTarget.value)}
          description={getDescription()}
        />
        <WorkoutForm dateKey={overrideDateKey} onSaved={() => router.push('/admin/workouts')} />
      </Stack>
    </PageContainer>
  );
}
