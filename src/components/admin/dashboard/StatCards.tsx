'use client';

import { SimpleGrid, Card, Stack, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface StatCardsProps {
  sharingCount: number;
  totalEligibleCount: number;
  todayCompletedCount: number;
  todayTotal: number;
  hasWorkoutToday: boolean;
  allTimeCompletionPercent: number;
  averageStreak: number;
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function StatCards({
  sharingCount,
  totalEligibleCount,
  todayCompletedCount,
  todayTotal,
  hasWorkoutToday,
  allTimeCompletionPercent,
  averageStreak,
}: StatCardsProps) {
  const todayPercent =
    hasWorkoutToday && todayTotal > 0
      ? Math.round((todayCompletedCount / todayTotal) * 100)
      : null;

  const cards = [
    {
      value: `${sharingCount}/${totalEligibleCount}`,
      label: 'משתפים מידע',
      color: 'brand',
    },
    {
      value: todayPercent === null ? '—' : `${todayPercent}%`,
      label: hasWorkoutToday ? `${todayCompletedCount}/${todayTotal} השלמה היום` : 'אין אימון היום',
      color:
        todayPercent === null
          ? 'dimmed'
          : todayPercent >= 70
            ? 'green'
            : todayPercent >= 40
              ? 'orange'
              : 'red',
    },
    {
      value: allTimeCompletionPercent > 0 ? `${allTimeCompletionPercent}%` : '—',
      label: 'השלמה כללית',
      color:
        allTimeCompletionPercent >= 70
          ? 'green'
          : allTimeCompletionPercent >= 40
            ? 'orange'
            : allTimeCompletionPercent > 0
              ? 'red'
              : 'dimmed',
    },
    {
      value: averageStreak > 0 ? String(averageStreak) : '—',
      label: 'רצף ממוצע (ימים)',
      color: 'orange',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      <SimpleGrid cols={2} spacing="sm">
        {cards.map((card) => (
          <motion.div key={card.label} variants={item}>
            <Card>
              <Stack align="center" gap={4}>
                <Text size="xl" fw={700} c={card.color}>
                  {card.value}
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  {card.label}
                </Text>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>
    </motion.div>
  );
}
