'use client';

import { Stack, Text, Table } from '@mantine/core';
import type { LeaderboardEntry } from '@/hooks/useAdminDashboardStats';

const MEDALS = ['🥇', '🥈', '🥉'];

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Stack gap="xs">
        <Text fw={600} size="sm">
          טבלת מצטיינים
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          אין משתמשים משתפים נתונים
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">
        טבלת מצטיינים
      </Text>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>שם</Table.Th>
            <Table.Th>השלמות</Table.Th>
            <Table.Th>אחוז</Table.Th>
            <Table.Th>רצף</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry, i) => (
            <Table.Tr key={entry.uid}>
              <Table.Td>
                <Text size="sm">{i < 3 ? MEDALS[i] : i + 1}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={i < 3 ? 600 : 400}>
                  {entry.name}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{entry.completed}/{entry.total}</Text>
              </Table.Td>
              <Table.Td>
                <Text
                  size="sm"
                  fw={600}
                  c={entry.percent >= 70 ? 'green' : entry.percent >= 40 ? 'orange' : 'red'}
                >
                  {entry.percent}%
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{entry.streak > 0 ? `🔥 ${entry.streak}` : '—'}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
