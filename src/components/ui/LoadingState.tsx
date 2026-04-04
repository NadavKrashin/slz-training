'use client';

import { useState, useEffect } from 'react';
import { Center, Stack } from '@mantine/core';
import { SealzStacked } from './Sealz';
import { getSealzMessage, getFirstMessage } from '@/lib/sealz/messages';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const [displayMessage, setDisplayMessage] = useState(
    () => message || getFirstMessage('loading'),
  );

  useEffect(() => {
    if (!message) setDisplayMessage(getSealzMessage('loading'));
  }, [message]);

  return (
    <Center py="xl" mih={200}>
      <Stack align="center" gap="sm">
        <SealzStacked
          pose="waiting"
          size="lg"
          animated
          message={displayMessage}
          bubbleVariant="light"
        />
      </Stack>
    </Center>
  );
}
