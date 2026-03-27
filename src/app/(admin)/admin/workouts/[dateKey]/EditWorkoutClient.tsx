'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stack, Text, Group, ActionIcon, TextInput } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { WorkoutForm } from '@/components/admin/WorkoutForm';
import { getHebrewDate, dateKeyToDate } from '@/lib/dates';

function EditWorkoutInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateKey = searchParams.get('dateKey') ?? '';
  const [overrideDateKey, setOverrideDateKey] = useState(dateKey);

  const getDescription = () => {
    try {
      return getHebrewDate(dateKeyToDate(overrideDateKey));
    } catch {
      return '';
    }
  };

  return (
    <PageContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon
            variant="subtle"
            aria-label="חזרה לרשימת אימונים"
            onClick={() => router.replace('/admin/workouts')}
          >
            <IconChevronRight size={20} />
          </ActionIcon>
          <Text size="xl" fw={700}>
            עריכת אימון
          </Text>
        </Group>
        <TextInput
          label="מפתח תאריך (YYYY-MM-DD)"
          value={overrideDateKey}
          onChange={(e) => setOverrideDateKey(e.currentTarget.value)}
          description={getDescription()}
        />
        <WorkoutForm dateKey={overrideDateKey} onSaved={() => router.replace('/admin/workouts')} />
      </Stack>
    </PageContainer>
  );
}

export function EditWorkoutClient() {
  return (
    <Suspense>
      <EditWorkoutInner />
    </Suspense>
  );
}
