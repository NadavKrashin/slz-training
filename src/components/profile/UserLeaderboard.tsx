'use client';

import { Stack, Text, Table, Skeleton, Center } from '@mantine/core';
import { motion } from 'framer-motion';
import type { UserLeaderboardEntry } from '@/hooks/useUserLeaderboard';

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#ffd43b', '#adb5bd', '#cd7f32'];

interface UserLeaderboardProps {
  entries: UserLeaderboardEntry[];
  loading: boolean;
  currentUid: string;
}

export function UserLeaderboard({ entries, loading, currentUid }: UserLeaderboardProps) {
  if (loading) {
    return (
      <Stack gap="xs">
        <Text fw={600} size="sm">המובילים</Text>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={36} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (entries.length === 0) {
    return (
      <Stack gap="xs">
        <Text fw={600} size="sm">המובילים</Text>
        <Center>
          <Text c="dimmed" size="sm">אין עדיין משתתפים במובילים</Text>
        </Center>
      </Stack>
    );
  }

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">המובילים 🏆</Text>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>שם</Table.Th>
              <Table.Th>רצף</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.map((entry, i) => {
              const isCurrentUser = entry.uid === currentUid;
              return (
                <Table.Tr
                  key={entry.uid}
                  style={{
                    ...(i < 3 ? { borderRight: `3px solid ${MEDAL_COLORS[i]}` } : {}),
                    ...(isCurrentUser
                      ? { background: 'var(--mantine-color-brand-0)' }
                      : {}),
                  }}
                >
                  <Table.Td>
                    <Text size="sm">{i < 3 ? MEDALS[i] : i + 1}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={isCurrentUser ? 700 : i < 3 ? 600 : 400}>
                      {entry.name}
                      {isCurrentUser && (
                        <Text span size="xs" c="brand.6" fw={400}>
                          {' '}(את/ה)
                        </Text>
                      )}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={isCurrentUser ? 700 : 400}>
                      {entry.streak > 0 ? `🔥 ${entry.streak}` : '0'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </motion.div>
    </Stack>
  );
}
