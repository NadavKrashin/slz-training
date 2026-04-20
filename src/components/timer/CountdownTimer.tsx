'use client';

import { Text, Box } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

export function CountdownTimer({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const units = [
    { value: seconds, label: 'שניות' },
    { value: minutes, label: 'דקות' },
    { value: hours, label: 'שעות' },
    { value: days, label: 'ימים' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}
    >
      <Box
        style={{
          display: 'flex',
          borderRadius: 'var(--mantine-radius-xl)',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          overflow: 'hidden',
        }}
      >
        {units.map((unit, i) => (
          <Box
            key={unit.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 8px',
              borderLeft: i < units.length - 1 ? '1px solid rgba(255,255,255,0.15)' : undefined,
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={unit.value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Text
                  fw={800}
                  c="white"
                  style={{ fontVariantNumeric: 'tabular-nums', fontSize: '2rem', lineHeight: 1 }}
                >
                  {String(unit.value).padStart(2, '0')}
                </Text>
              </motion.div>
            </AnimatePresence>
            <Text size="xs" fw={500} c="rgba(255,255,255,0.7)" mt={4}>
              {unit.label}
            </Text>
          </Box>
        ))}
      </Box>
    </motion.div>
  );
}
