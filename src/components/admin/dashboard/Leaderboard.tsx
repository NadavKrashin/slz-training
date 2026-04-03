'use client';

import { Stack, Text, Table } from '@mantine/core';
import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '@/hooks/useAdminDashboardStats';

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#ffd43b', '#adb5bd', '#cd7f32'];

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Table highlightOnHover>
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
              <Table.Tr
                key={entry.uid}
                style={
                  i < 3
                    ? {
                        borderRight: `3px solid ${MEDAL_COLORS[i]}`,
                      }
                    : undefined
                }
              >
                <Table.Td>
                  <Text size="sm">{i < 3 ? MEDALS[i] : i + 1}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={i < 3 ? 600 : 400}>
                    {entry.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {entry.completed}/{entry.total}
                  </Text>
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
                  <Text size="sm">{entry.streak > 0 ? `🔥 ${entry.streak}` : '0'}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </motion.div>
    </Stack>
  );
}
