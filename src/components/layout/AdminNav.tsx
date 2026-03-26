'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Box, Group, UnstyledButton, Text, ScrollArea } from '@mantine/core';
import { IconBarbell, IconUsers, IconCalendarEvent, IconMessage, IconClock, IconChevronRight } from '@tabler/icons-react';

const ADMIN_ITEMS = [
  { label: 'אימונים', icon: IconBarbell, path: '/admin/workouts' },
  { label: 'משתמשים', icon: IconUsers, path: '/admin/users' },
  { label: 'סקירה יומית', icon: IconCalendarEvent, path: '/admin/daily' },
  { label: 'הודעות', icon: IconMessage, path: '/admin/messages' },
  { label: 'טיימר', icon: IconClock, path: '/admin/timer' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      style={{
        borderRadius: 0, position: 'sticky', top: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #4c6ef5 0%, #5c7cfa 100%)',
        boxShadow: '0 2px 12px rgba(76, 110, 245, 0.2)',
      }}
    >
      <ScrollArea type="never">
        <Group gap={0} wrap="nowrap" px="xs" h={50}>
          <UnstyledButton onClick={() => router.push('/home')} px="sm">
            <Group gap={4}><IconChevronRight size={16} color="white" /><Text size="sm" fw={600} c="white">חזרה</Text></Group>
          </UnstyledButton>
          {ADMIN_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <UnstyledButton
                key={item.path}
                onClick={() => router.push(item.path)}
                px="sm"
                py={6}
                style={{
                  borderRadius: 'var(--mantine-radius-xl)',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <Group gap={6} wrap="nowrap">
                  <item.icon size={18} color="white" />
                  <Text size="sm" fw={isActive ? 700 : 400} c="white" style={{ whiteSpace: 'nowrap' }}>{item.label}</Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </Group>
      </ScrollArea>
    </Box>
  );
}
