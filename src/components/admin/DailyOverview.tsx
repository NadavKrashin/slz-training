'use client';

import { useEffect, useState } from 'react';
import { Stack, Group, Text, Card, Badge, Table, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getTodayDateKey, getHebrewDate } from '@/lib/dates';
import { getAllCompletionsForUser, getAllUsers, getWorkout } from '@/lib/firebase/firestore';
import type { UserProfile, Workout } from '@/lib/types';

export function DailyOverview() {
  const [dateKey] = useState(getTodayDateKey);
  const [completedUids, setCompletedUids] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allUsers, w] = await Promise.all([getAllUsers(), getWorkout(dateKey)]);
      const sharing = allUsers.filter((u) => u.shareCompletionWithAdmin && u.role !== 'admin');
      // Query completions per sharing user to satisfy security rules
      const perUserComps = await Promise.all(
        sharing.map((u) => getAllCompletionsForUser(u.uid, dateKey))
      );
      const uidsCompleted = new Set<string>();
      perUserComps.forEach((comps, i) => {
        if (comps.some((c) => c.dateKey === dateKey && c.completed)) {
          uidsCompleted.add(sharing[i].uid);
        }
      });
      setUsers(allUsers);
      setWorkout(w);
      setCompletedUids(uidsCompleted);
      setLoading(false);
    }
    load();
  }, [dateKey]);

  if (loading) return <Text c="dimmed">טוען...</Text>;

  const sharingUsers = users.filter((u) => u.shareCompletionWithAdmin && u.role !== 'admin');
  const completedCount = sharingUsers.filter((u) => completedUids.has(u.uid)).length;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={600}>{getHebrewDate(new Date())}</Text>
        {workout && <Badge variant="light">{workout.title}</Badge>}
      </Group>
      {!workout && (
        <Card>
          <Text c="dimmed" ta="center">
            אין אימון מוגדר להיום
          </Text>
        </Card>
      )}
      <Group>
        <Card style={{ flex: 1 }}>
          <Stack align="center" gap={4}>
            <Text size="xl" fw={700} c="green">
              {completedCount}
            </Text>
            <Text size="xs" c="dimmed">
              השלימו
            </Text>
          </Stack>
        </Card>
        <Card style={{ flex: 1 }}>
          <Stack align="center" gap={4}>
            <Text size="xl" fw={700} c="red">
              {sharingUsers.length - completedCount}
            </Text>
            <Text size="xs" c="dimmed">
              טרם השלימו
            </Text>
          </Stack>
        </Card>
        <Card style={{ flex: 1 }}>
          <Stack align="center" gap={4}>
            <Text size="xl" fw={700}>
              {sharingUsers.length}
            </Text>
            <Text size="xs" c="dimmed">
              סה״כ משתפים
            </Text>
          </Stack>
        </Card>
      </Group>
      {sharingUsers.length > 0 && (
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>שם</Table.Th>
              <Table.Th>סטטוס</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sharingUsers.map((u) => {
              const done = completedUids.has(u.uid);
              return (
                <Table.Tr key={u.uid}>
                  <Table.Td>{u.displayName}</Table.Td>
                  <Table.Td>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color={done ? 'green' : 'gray'}
                      radius="xl"
                    >
                      {done ? <IconCheck size={12} /> : <IconX size={12} />}
                    </ThemeIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
