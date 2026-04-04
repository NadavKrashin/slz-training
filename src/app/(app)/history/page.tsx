'use client';

import { useState, useEffect, useRef } from 'react';
import { Stack, Text, Box, Container, Skeleton } from '@mantine/core';
import { CalendarGrid } from '@/components/history/CalendarGrid';
import { MonthNavigator } from '@/components/history/MonthNavigator';
import { MonthlySummary } from '@/components/history/MonthlySummary';
import { useCompletions } from '@/hooks/useCompletions';
import { useAllTimeStats } from '@/hooks/useAllTimeStats';
import { useAppData } from '@/contexts/AppDataContext';
import { getMonthRange, getHebrewMonthYear, getTodayDateKey } from '@/lib/dates';
import { getWorkoutsInRange } from '@/lib/firebase/firestore';
import { NAV_HEIGHT } from '@/lib/constants';

const workoutDatesCache = new Map<string, Set<string>>();

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const { start, end } = getMonthRange(year, month);
  const { completions, loading } = useCompletions(start, end);
  const { currentStreak } = useAppData();
  const { totalCompleted, totalPosted } = useAllTimeStats();
  const rangeKey = `${start}:${end}`;
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(workoutDatesCache.get(rangeKey) ?? new Set());

  useEffect(() => {
    getWorkoutsInRange(start, end).then((ws) => {
      const set = new Set(ws.map((w) => w.dateKey));
      workoutDatesCache.set(rangeKey, set);
      setWorkoutDates(set);
    });
  }, [start, end, rangeKey]);

  const todayKey = getTodayDateKey();
  const canGoNext = `${year}-${String(month + 2).padStart(2, '0')}` <= todayKey.slice(0, 7);

  const goNext = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goPrev = () => setCurrentMonth(new Date(year, month - 1, 1));

  return (
    <Box pb={NAV_HEIGHT + 24}>
      {/* Header with title + month nav integrated */}
      <Box
        style={{
          background: 'linear-gradient(160deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
          borderRadius: '0 0 24px 24px',
        }}
        px="md"
        pt={36}
        pb={24}
      >
        <Container size="sm">
          <Stack gap="md">
            <Text size="lg" fw={700} c="white" ta="center">
              היסטוריה
            </Text>
            <MonthNavigator
              label={getHebrewMonthYear(currentMonth)}
              onPrev={goPrev}
              onNext={goNext}
              canGoNext={canGoNext}
            />
          </Stack>
        </Container>
      </Box>

      <Container size="sm" px="md" pt="lg">
        <Stack gap="lg">
          {loading ? (
            <>
              <Skeleton h={240} radius="lg" />
              <Skeleton h={100} radius="lg" />
            </>
          ) : (
            <>
              <CalendarGrid
                year={year}
                month={month}
                completions={completions}
                workoutDates={workoutDates}
              />
              <MonthlySummary
                completed={totalCompleted}
                missed={totalPosted - totalCompleted}
                total={totalPosted}
                streak={currentStreak}
              />
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
