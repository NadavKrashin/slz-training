'use client';

import { Group, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import type { SealzPose, SealzSize } from '@/lib/sealz/types';
import { SEALZ_SIZE_MAP } from '@/lib/sealz/types';
import { getPoseAssetPath } from '@/lib/sealz/poses';
import { SealzBubble, type TailDirection } from './SealzBubble';

interface SealzProps {
  pose: SealzPose;
  size?: SealzSize;
  message?: string;
  showBubble?: boolean;
  animated?: boolean;
  bubbleVariant?: 'glass' | 'light';
  tailDirection?: TailDirection;
}

const entranceTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 15,
  delay: 0.1,
};

interface SealzImageProps {
  pose: SealzPose;
  w: number;
  h: number;
  animated: boolean;
}

function SealzImage({ pose, w, h, animated }: SealzImageProps) {
  const isCelebrating = pose === 'celebrating' || pose === 'celebrating-proud';

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getPoseAssetPath(pose)}
      alt={`Sealz ${pose}`}
      width={w}
      height={h}
      style={{
        width: w,
        height: h,
        objectFit: 'contain',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );

  if (isCelebrating) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={entranceTransition}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.4 }}
        >
          {img}
        </motion.div>
      </motion.div>
    );
  }

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={entranceTransition}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {img}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={entranceTransition}
    >
      {img}
    </motion.div>
  );
}

export function Sealz({
  pose,
  size = 'lg',
  message,
  showBubble,
  animated = false,
  bubbleVariant = 'glass',
  tailDirection = 'right',
}: SealzProps) {
  const { width, height } = SEALZ_SIZE_MAP[size];
  const shouldShowBubble = showBubble ?? !!message;

  return (
    <Group align="center" gap="sm" wrap="nowrap" justify="center">
      <div style={{ flexShrink: 0 }}>
        <SealzImage pose={pose} w={width} h={height} animated={animated} />
      </div>
      {shouldShowBubble && message && (
        <SealzBubble message={message} variant={bubbleVariant} tailDirection={tailDirection} />
      )}
    </Group>
  );
}

export function SealzStacked({
  pose,
  size = 'lg',
  message,
  showBubble,
  animated = false,
  bubbleVariant = 'glass',
  tailDirection = 'top',
}: SealzProps) {
  const { width, height } = SEALZ_SIZE_MAP[size];
  const shouldShowBubble = showBubble ?? !!message;

  return (
    <Stack align="center" gap="sm">
      <SealzImage pose={pose} w={width} h={height} animated={animated} />
      {shouldShowBubble && message && (
        <SealzBubble message={message} variant={bubbleVariant} tailDirection={tailDirection} />
      )}
    </Stack>
  );
}
