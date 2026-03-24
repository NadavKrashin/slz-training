'use client';

import { Card, Stack, Group, Text, Button, Badge, Divider, ThemeIcon } from '@mantine/core';
import { IconCheck, IconPlayerPlay } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { formatSeconds } from '@/lib/dates';
import { StagesList } from './StagesList';
import type { Workout } from '@/lib/types';

interface WorkoutCardProps { workout: Workout; isCompleted: boolean; }

export function WorkoutCard({ workout, isCompleted }: WorkoutCardProps) {
  const router = useRouter();

  return (
    <Card>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="xl" fw={700}>{workout.title}</Text>
            {workout.description && <Text size="sm" c="dimmed">{workout.description}</Text>}
          </Stack>
          {isCompleted && (
            <ThemeIcon size={40} radius="xl" color="green"><IconCheck size={24} /></ThemeIcon>
          )}
        </Group>
        <Group gap="xs">
          <Badge variant="light" color="brand">{workout.stages.length} שלבים</Badge>
          <Badge variant="light" color="gray">{formatSeconds(workout.totalDurationSeconds)}</Badge>
        </Group>
        <Divider />
        <StagesList stages={workout.stages} />
        <Button fullWidth size="lg"
          leftSection={isCompleted ? <IconCheck size={20} /> : <IconPlayerPlay size={20} />}
          color={isCompleted ? 'green' : 'brand'}
          variant={isCompleted ? 'light' : 'filled'}
          onClick={() => router.push('/workout')}>
          {isCompleted ? 'התחל שוב' : 'התחל אימון'}
        </Button>
      </Stack>
    </Card>
  );
}
