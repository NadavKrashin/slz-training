'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stack, Text, Group, ActionIcon, Card, Badge, Divider } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CalendarGrid } from '@/components/history/CalendarGrid';
import { MonthNavigator } from '@/components/history/MonthNavigator';
import { MonthlySummary } from '@/components/history/MonthlySummary';
import { useCompletionsForUid } from '@/hooks/useCompletions';
import { subscribeToUser, getWorkoutsInRange } from '@/lib/firebase/firestore';
import { getMonthRange, getHebrewMonthYear, getTodayDateKey } from '@/lib/dates';
import type { UserProfile } from '@/lib/types';

function UserDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get('uid') ?? '';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const { start, end } = getMonthRange(year, month);
  const { completions, loading: compLoading } = useCompletionsForUid(uid, start, end);
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = subscribeToUser(uid, (data) => {
      setProfile(data);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  useEffect(() => {
    getWorkoutsInRange(start, end).then((ws) => {
      setWorkoutDates(new Set(ws.map((w) => w.dateKey)));
    });
  }, [start, end]);

  const todayKey = getTodayDateKey();
  const canGoNext = `${year}-${String(month + 2).padStart(2, '0')}` <= todayKey.slice(0, 7);
  const goNext = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goPrev = () => setCurrentMonth(new Date(year, month - 1, 1));

  const completed = Array.from(completions.values()).filter((c) => c.completed).length;
  const total = workoutDates.size;

  if (loading)
    return (
      <PageContainer>
        <Text c="dimmed">טוען...</Text>
      </PageContainer>
    );

  return (
    <PageContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon
            variant="subtle"
            aria-label="חזרה לרשימת משתמשים"
            onClick={() => router.replace('/admin/users')}
          >
            <IconChevronRight size={20} />
          </ActionIcon>
          <Text size="xl" fw={700}>
            {profile?.displayName}
          </Text>
        </Group>
        <Card>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {profile?.email}
              </Text>
              <Badge variant="light" color={profile?.role === 'admin' ? 'brand' : 'gray'}>
                {profile?.role === 'admin' ? 'מנהל' : 'משתמש'}
              </Badge>
            </Group>
            <Group>
              <Text size="sm">
                שיתוף:{' '}
                <Text component="span" fw={700}>
                  {profile?.shareCompletionWithAdmin ? 'כן' : 'לא'}
                </Text>
              </Text>
            </Group>
          </Stack>
        </Card>
        <Divider label="היסטוריית אימונים" />
        <MonthNavigator
          label={getHebrewMonthYear(currentMonth)}
          onPrev={goPrev}
          onNext={goNext}
          canGoNext={canGoNext}
        />
        {compLoading ? (
          <Text c="dimmed" ta="center">
            טוען...
          </Text>
        ) : (
          <>
            <CalendarGrid
              year={year}
              month={month}
              completions={completions}
              workoutDates={workoutDates}
            />
            <MonthlySummary
              completed={completed}
              missed={total - completed}
              total={total}
              streak={0}
            />
          </>
        )}
      </Stack>
    </PageContainer>
  );
}

export function UserDetailClient() {
  return (
    <Suspense>
      <UserDetailInner />
    </Suspense>
  );
}
