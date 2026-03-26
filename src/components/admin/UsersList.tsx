'use client';

import { useEffect, useState } from 'react';
import { Stack, TextInput, Table, Badge, Text, UnstyledButton, Group, Switch } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/lib/types';

export function UsersList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showGuests, setShowGuests] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getAllUsers().then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const guestCount = users.filter((u) => u.role === 'guest').length;
  const filtered = users.filter(
    (u) => (showGuests || u.role !== 'guest') &&
      (u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) return <Text c="dimmed">טוען משתמשים...</Text>;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <TextInput placeholder="חיפוש לפי שם או אימייל" leftSection={<IconSearch size={16} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} style={{ flex: 1 }} />
        {guestCount > 0 && (
          <Switch label={`הצג אורחים (${guestCount})`} checked={showGuests} onChange={(e) => setShowGuests(e.currentTarget.checked)} />
        )}
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>שם</Table.Th>
            <Table.Th>אימייל</Table.Th>
            <Table.Th>תפקיד</Table.Th>
            <Table.Th>שיתוף</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.map((u) => (
            <UnstyledButton key={u.uid} component="tr" onClick={() => router.push(`/admin/users/${u.uid}`)} style={{ cursor: 'pointer' }}>
              <Table.Td><Text fw={500}>{u.displayName}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{u.email}</Text></Table.Td>
              <Table.Td><Badge variant="light" color={u.role === 'admin' ? 'brand' : u.role === 'guest' ? 'yellow' : 'gray'}>{u.role === 'admin' ? 'מנהל' : u.role === 'guest' ? 'אורח' : 'משתמש'}</Badge></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <Badge variant="dot" color={u.shareCompletionWithAdmin ? 'green' : 'gray'}>
                    {u.shareCompletionWithAdmin ? 'משתף' : 'לא משתף'}
                  </Badge>
                </Group>
              </Table.Td>
            </UnstyledButton>
          ))}
        </Table.Tbody>
      </Table>
      {filtered.length === 0 && <Text c="dimmed" ta="center">לא נמצאו משתמשים</Text>}
    </Stack>
  );
}
