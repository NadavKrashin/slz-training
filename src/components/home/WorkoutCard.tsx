'use client';

import { Card, Stack, Group, Text, Button, Badge, Divider, ThemeIcon, Box } from '@mantine/core';
import { IconCheck, IconPlayerPlay } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { formatSeconds } from '@/lib/dates';
import { StagesList } from './StagesList';
import type { Workout } from '@/lib/types';

interface WorkoutCardProps {
  workout: Workout;
  isCompleted: boolean;
}

export function WorkoutCard({ workout, isCompleted }: WorkoutCardProps) {
  const router = useRouter();

  return (
    <Card p={0} style={{ overflow: 'hidden' }}>
      <Box
        px="lg"
        py="md"
        style={{
          background: isCompleted
            ? 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)'
            : 'linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%)',
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="lg" fw={700} c="white">
              {workout.title}
            </Text>
            {workout.description && (
              <Text size="sm" c="rgba(255,255,255,0.8)">
                {workout.description}
              </Text>
            )}
          </Stack>
          {isCompleted && (
            <ThemeIcon size={36} radius="xl" color="white" variant="filled" c="green.7">
              <IconCheck size={22} />
            </ThemeIcon>
          )}
        </Group>
      </Box>
      <Stack gap="md" p="lg">
        <Group gap="xs">
          <Badge variant="light" color="brand" size="md">
            {workout.stages.length} שלבים
          </Badge>
          <Badge variant="light" color="gray" size="md">
            {formatSeconds(workout.totalDurationSeconds)}
          </Badge>
        </Group>
        <Divider color="brand.1" />
        <StagesList stages={workout.stages} />
        {isCompleted ? (
          <Button fullWidth size="lg" leftSection={<IconCheck size={20} />} color="green" variant="filled" disabled>
            האימון הושלם
          </Button>
        ) : (
          <Button fullWidth size="lg" leftSection={<IconPlayerPlay size={20} />} color="brand" variant="filled" onClick={() => router.push('/workout')}>
            התחל אימון
          </Button>
        )}
      </Stack>
    </Card>
  );
}
