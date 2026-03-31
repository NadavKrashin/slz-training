'use client';

import { Text, Box } from '@mantine/core';

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
    <Box
      style={{
        display: 'flex',
        borderRadius: 'var(--mantine-radius-xl)',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 360,
        margin: '0 auto',
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
            borderLeft: i < units.length - 1 ? '1px solid rgba(255,255,255,0.2)' : undefined,
          }}
        >
          <Text
            fw={800}
            c="white"
            style={{ fontVariantNumeric: 'tabular-nums', fontSize: '2rem', lineHeight: 1 }}
          >
            {String(unit.value).padStart(2, '0')}
          </Text>
          <Text size="xs" fw={500} c="rgba(255,255,255,0.7)" mt={4}>
            {unit.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
