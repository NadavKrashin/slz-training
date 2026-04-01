'use client';

import { Group, Stack, Text, ThemeIcon, Card } from '@mantine/core';
import { IconCheck, IconFlame, IconChartBar } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface MonthlySummaryProps {
  completed: number;
  missed: number;
  total: number;
  streak: number;
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function MonthlySummary({ completed, total, streak }: MonthlySummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { value: completed, label: 'הושלמו', icon: IconCheck, color: 'green' },
    { value: streak, label: 'רצף נוכחי', icon: IconFlame, color: 'orange' },
    { value: `${percentage}%`, label: 'הצלחה', icon: IconChartBar, color: 'brand' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      <Group grow gap="sm">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card padding="sm">
              <Stack align="center" gap={6}>
                <ThemeIcon size={36} variant="light" color={s.color}>
                  <s.icon size={20} />
                </ThemeIcon>
                <Text size="xl" fw={700}>
                  {s.value}
                </Text>
                <Text size="xs" c="dimmed">
                  {s.label}
                </Text>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Group>
    </motion.div>
  );
}
