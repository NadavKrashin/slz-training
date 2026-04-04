'use client';

import { Box, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

export type TailDirection = 'right' | 'left' | 'top' | 'bottom';

interface SealzBubbleProps {
  message: string;
  variant?: 'glass' | 'light';
  tailDirection?: TailDirection;
  delay?: number;
}

const VARIANT_STYLES = {
  glass: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    tailColor: 'rgba(255,255,255,0.15)',
  },
  light: {
    background: 'white',
    backdropFilter: 'none',
    color: 'var(--mantine-color-gray-8)',
    tailColor: 'white',
  },
} as const;

function getTailStyle(direction: TailDirection, tailColor: string): CSSProperties {
  const base: CSSProperties = { position: 'absolute', width: 0, height: 0 };

  switch (direction) {
    case 'right':
      return {
        ...base,
        top: '50%',
        right: -8,
        marginTop: -6,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: `8px solid ${tailColor}`,
      };
    case 'left':
      return {
        ...base,
        top: '50%',
        left: -8,
        marginTop: -6,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderRight: `8px solid ${tailColor}`,
      };
    case 'top':
      return {
        ...base,
        top: -8,
        left: '50%',
        marginLeft: -6,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: `8px solid ${tailColor}`,
      };
    case 'bottom':
      return {
        ...base,
        bottom: -8,
        left: '50%',
        marginLeft: -6,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `8px solid ${tailColor}`,
      };
  }
}

const ENTRANCE_OFFSET: Record<TailDirection, { x?: number; y?: number }> = {
  right: { x: -10 },
  left: { x: 10 },
  top: { y: 10 },
  bottom: { y: -10 },
};

export function SealzBubble({
  message,
  variant = 'glass',
  tailDirection = 'right',
  delay = 0.3,
}: SealzBubbleProps) {
  const style = VARIANT_STYLES[variant];
  const offset = ENTRANCE_OFFSET[tailDirection];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
    >
      <Box
        px="md"
        py="xs"
        style={{
          borderRadius: 16,
          background: style.background,
          backdropFilter: style.backdropFilter,
          direction: 'rtl',
          maxWidth: 260,
          position: 'relative',
        }}
      >
        <Box style={getTailStyle(tailDirection, style.tailColor)} />
        <Text size="sm" fw={600} style={{ color: style.color, lineHeight: 1.5 }}>
          {message}
        </Text>
      </Box>
    </motion.div>
  );
}
