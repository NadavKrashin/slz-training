'use client';

import { useState, useEffect } from 'react';
import { Stack, Text } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { CalendarGrid } from '@/components/history/CalendarGrid';
import { MonthNavigator } from '@/components/history/MonthNavigator';
import { MonthlySummary } from '@/components/history/MonthlySummary';
import { useCompletions } from '@/hooks/useCompletions';
import { useStreak } from '@/hooks/useStreak';
import { getMonthRange, getHebrewMonthYear, getTodayDateKey } from '@/lib/dates';
import { getWorkoutsInRange } from '@/lib/firebase/firestore';

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const { start, end } = getMonthRange(year, month);
  const { completions, loading } = useCompletions(start, end);
  const { currentStreak } = useStreak();
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());

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

  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">היסטוריה</Text>
        <MonthNavigator label={getHebrewMonthYear(currentMonth)} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
        {loading ? (
          <Text c="dimmed" ta="center">טוען...</Text>
        ) : (
          <>
            <CalendarGrid year={year} month={month} completions={completions} workoutDates={workoutDates} />
            <MonthlySummary completed={completed} missed={total - completed} total={total} streak={currentStreak} />
          </>
        )}
      </Stack>
    </PageContainer>
  );
}
