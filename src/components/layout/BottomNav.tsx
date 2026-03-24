'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Paper, UnstyledButton, Stack, Text, Group } from '@mantine/core';
import { IconHome, IconCalendar, IconClock, IconUser, IconSettings } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_HEIGHT } from '@/lib/constants';

const NAV_ITEMS = [
  { label: 'בית', icon: IconHome, path: '/home' },
  { label: 'היסטוריה', icon: IconCalendar, path: '/history' },
  { label: 'טיימר', icon: IconClock, path: '/timer' },
  { label: 'פרופיל', icon: IconUser, path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();

  const items = isAdmin
    ? [...NAV_ITEMS, { label: 'ניהול', icon: IconSettings, path: '/admin' }]
    : NAV_ITEMS;

  return (
    <Paper
      shadow="lg"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        borderRadius: 0, borderTop: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group justify="space-around" h={NAV_HEIGHT} px="xs">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <UnstyledButton key={item.path} onClick={() => router.push(item.path)} style={{ flex: 1 }}>
              <Stack align="center" gap={4}>
                <item.icon size={24} color={isActive ? 'var(--mantine-color-brand-6)' : 'var(--mantine-color-gray-5)'} stroke={isActive ? 2.5 : 1.5} />
                <Text size="xs" fw={isActive ? 700 : 400} c={isActive ? 'brand.6' : 'gray.5'}>{item.label}</Text>
              </Stack>
            </UnstyledButton>
          );
        })}
      </Group>
    </Paper>
  );
}
