'use client';

import { useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { DailyOverview } from '@/components/admin/DailyOverview';
import { getAllUsers, getWorkout, getCompletionsForDate } from '@/lib/firebase/firestore';
import { getTodayDateKey } from '@/lib/dates';
import type { UserProfile, Workout } from '@/lib/types';

export default function DailyPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completedUids, setCompletedUids] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = getTodayDateKey();
    Promise.all([getAllUsers(), getWorkout(today), getCompletionsForDate(today)])
      .then(([allUsers, w, completions]) => {
        setUsers(allUsers);
        setWorkout(w);
        setCompletedUids(new Set(completions.map((c) => c.uid)));
      })
      .catch(() => {});
  }, []);

  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">
          סקירה יומית
        </Text>
        <DailyOverview users={users} workout={workout} completedUids={completedUids} />
      </Stack>
    </PageContainer>
  );
}
