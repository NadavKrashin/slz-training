'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  Button,
  SegmentedControl,
  ActionIcon,
  Box,
} from '@mantine/core';
import { IconBug, IconX, IconPlayerPlay, IconClock } from '@tabler/icons-react';
import {
  setTimeScale,
  setClockOffset,
  resetClock,
  getTimeScale,
  getClockOffset,
} from '@/lib/clock';

const SPEED_OPTIONS = [
  { label: '1x', value: '1' },
  { label: '2x', value: '2' },
  { label: '5x', value: '5' },
  { label: '10x', value: '10' },
  { label: '60x', value: '60' },
];

export function DevToolbar() {
  const [open, setOpen] = useState(false);
  const [speed, setSpeed] = useState('1');
  const [offsetHours, setOffsetHours] = useState(0);

  // Toggle with Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSpeedChange = useCallback((value: string) => {
    setSpeed(value);
    setTimeScale(parseInt(value));
  }, []);

  const handleOffsetChange = useCallback((hours: number) => {
    setOffsetHours(hours);
    setClockOffset(hours * 60 * 60 * 1000);
  }, []);

  const handleReset = useCallback(() => {
    setSpeed('1');
    setOffsetHours(0);
    resetClock();
  }, []);

  const handleSimulateMidnight = useCallback(() => {
    // Calculate offset to set clock to 23:59:50 IST
    const now = new Date();
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = istFormatter.formatToParts(now);
    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || '0');
    const currentSecondsIST = get('hour') * 3600 + get('minute') * 60 + get('second');
    const targetSecondsIST = 23 * 3600 + 59 * 60 + 50; // 23:59:50
    const diffSeconds = targetSecondsIST - currentSecondsIST;
    handleOffsetChange(diffSeconds / 3600);
  }, [handleOffsetChange]);

  const triggerReminder = useCallback(() => {
    const cmd = `curl -X POST http://localhost:5001/demo-slz-training/us-central1/sendDailyReminder-0 -H "Content-Type: application/json" -d '{}'`;
    navigator.clipboard.writeText(cmd).then(
      () => alert('Copied to clipboard — paste and run in terminal'),
      () => alert(cmd)
    );
  }, []);

  if (!open) {
    return (
      <ActionIcon
        onClick={() => setOpen(true)}
        variant="filled"
        color="orange"
        size="lg"
        radius="xl"
        style={{ position: 'fixed', bottom: 90, left: 16, zIndex: 9999, opacity: 0.8 }}
        title="Dev Toolbar (Ctrl+Shift+D)"
      >
        <IconBug size={20} />
      </ActionIcon>
    );
  }

  return (
    <Paper
      shadow="xl"
      p="md"
      radius="lg"
      style={{
        position: 'fixed',
        bottom: 90,
        left: 16,
        right: 16,
        maxWidth: 380,
        zIndex: 9999,
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 165, 0, 0.3)',
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="xs">
            <IconBug size={16} color="orange" />
            <Text size="sm" fw={700} c="orange">
              Dev Tools
            </Text>
          </Group>
          <ActionIcon variant="subtle" c="gray.5" onClick={() => setOpen(false)} size="sm">
            <IconX size={14} />
          </ActionIcon>
        </Group>

        {/* Timer Speed */}
        <Box>
          <Text size="xs" c="gray.4" mb={4}>
            <IconPlayerPlay size={12} style={{ verticalAlign: 'middle' }} /> Timer Speed
            {speed !== '1' && (
              <Text span c="orange" fw={700}>
                {' '}
                ({speed}x active)
              </Text>
            )}
          </Text>
          <SegmentedControl
            data={SPEED_OPTIONS}
            value={speed}
            onChange={handleSpeedChange}
            size="xs"
            fullWidth
            color="orange"
            styles={{ root: { backgroundColor: 'rgba(255,255,255,0.05)' } }}
          />
        </Box>

        {/* Clock Offset */}
        <Box>
          <Text size="xs" c="gray.4" mb={4}>
            <IconClock size={12} style={{ verticalAlign: 'middle' }} /> Clock Offset
            {offsetHours !== 0 && (
              <Text span c="orange" fw={700}>
                {' '}
                ({offsetHours > 0 ? '+' : ''}
                {offsetHours.toFixed(1)}h)
              </Text>
            )}
          </Text>
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              color="gray"
              onClick={() => handleOffsetChange(offsetHours - 1)}
            >
              -1h
            </Button>
            <Button
              size="xs"
              variant="light"
              color="gray"
              onClick={() => handleOffsetChange(offsetHours + 1)}
            >
              +1h
            </Button>
            <Button size="xs" variant="light" color="yellow" onClick={handleSimulateMidnight}>
              → 23:59:50
            </Button>
          </Group>
        </Box>

        {/* Quick Actions */}
        <Group gap="xs">
          <Button size="xs" variant="light" color="red" onClick={handleReset}>
            Reset All
          </Button>
          <Button size="xs" variant="light" color="blue" onClick={triggerReminder}>
            Trigger Reminder
          </Button>
        </Group>

        <Text size="xs" c="gray.6" ta="center">
          {getTimeScale()}x speed | offset: {(getClockOffset() / 3600000).toFixed(1)}h |
          Ctrl+Shift+D to toggle
        </Text>
      </Stack>
    </Paper>
  );
}
