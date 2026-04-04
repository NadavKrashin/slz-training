'use client';

import { Box, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface SealzBubbleProps {
  message: string;
  variant?: 'glass' | 'light';
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

export function SealzBubble({ message, variant = 'glass', delay = 0.3 }: SealzBubbleProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
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
        {/* Tail pointing toward Sealz (right side in RTL) */}
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            right: -8,
            marginTop: -6,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: `8px solid ${style.tailColor}`,
          }}
        />
        <Text size="sm" fw={600} style={{ color: style.color, lineHeight: 1.5 }}>
          {message}
        </Text>
      </Box>
    </motion.div>
  );
}
