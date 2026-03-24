'use client';

import { Center, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { DayStatus } from '@/lib/types';

export function DayCell({ day, status, isToday }: { day: number; status: DayStatus; isToday: boolean }) {
  const bgColor = { completed: 'var(--mantine-color-green-1)', missed: 'var(--mantine-color-red-1)', neutral: 'transparent', future: 'transparent' }[status];
  const borderColor = isToday ? 'var(--mantine-color-brand-6)' : 'transparent';

  return (
    <Center w={40} h={40} style={{ borderRadius: 'var(--mantine-radius-md)', backgroundColor: bgColor, border: `2px solid ${borderColor}`, position: 'relative' }}>
      <Text size="sm" fw={isToday ? 700 : 400} c={status === 'future' ? 'gray.4' : undefined}>{day}</Text>
      {status === 'completed' && <IconCheck size={12} color="var(--mantine-color-green-7)" style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)' }} />}
      {status === 'missed' && <IconX size={12} color="var(--mantine-color-red-7)" style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)' }} />}
    </Center>
  );
}
