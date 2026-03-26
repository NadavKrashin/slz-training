'use client';

import { SimpleGrid, Center, Text, Stack, Card } from '@mantine/core';
import { HEBREW_DAYS_SHORT } from '@/lib/constants';
import { getDaysInMonth, getFirstDayOfMonth, getTodayDateKey } from '@/lib/dates';
import type { DayStatus, WorkoutCompletion } from '@/lib/types';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  year: number;
  month: number;
  completions: Map<string, WorkoutCompletion>;
  workoutDates: Set<string>;
}

export function CalendarGrid({ year, month, completions, workoutDates }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayKey = getTodayDateKey();

  function getStatus(day: number): DayStatus {
    const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dk > todayKey) return 'future';
    const hasWorkout = workoutDates.has(dk);
    const completion = completions.get(dk);
    if (!hasWorkout) return 'neutral';
    if (completion?.completed) return 'completed';
    if (dk < todayKey) return 'missed';
    return 'neutral';
  }

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(<Center key={`empty-${i}`} w={40} h={40} />);
  for (let day = 1; day <= daysInMonth; day++) {
    const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push(<DayCell key={day} day={day} status={getStatus(day)} isToday={dk === todayKey} />);
  }

  return (
    <Card p="md" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #eef3ff 100%)' }}>
      <Stack gap="xs">
        <SimpleGrid cols={7} spacing={4}>
          {HEBREW_DAYS_SHORT.map((d) => (
            <Center key={d} h={30}>
              <Text size="xs" fw={600} c="brand.5">
                {d}
              </Text>
            </Center>
          ))}
        </SimpleGrid>
        <SimpleGrid cols={7} spacing={4}>
          {cells}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
