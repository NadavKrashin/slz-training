'use client';

import { Group, Text } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <Group gap={6} justify="center" align="center">
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex' }}
      >
        <IconFlame size={18} color={streak > 0 ? '#ffd43b' : 'rgba(255,255,255,0.5)'} />
      </motion.div>
      <Text size="sm" fw={700} c="white">
        {streak} ימים רצוף
      </Text>
    </Group>
  );
}
