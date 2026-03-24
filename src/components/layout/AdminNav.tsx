'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Paper, Group, UnstyledButton, Text, ScrollArea } from '@mantine/core';
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
    <Paper shadow="sm" style={{ borderRadius: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <ScrollArea type="never">
        <Group gap={0} wrap="nowrap" px="xs" h={50}>
          <UnstyledButton onClick={() => router.push('/home')} px="sm">
            <Group gap={4}><IconChevronRight size={16} /><Text size="sm" fw={600}>חזרה</Text></Group>
          </UnstyledButton>
          {ADMIN_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <UnstyledButton key={item.path} onClick={() => router.push(item.path)} px="sm"
                style={{ borderBottom: isActive ? '3px solid var(--mantine-color-brand-6)' : '3px solid transparent' }}>
                <Group gap={6} wrap="nowrap">
                  <item.icon size={18} />
                  <Text size="sm" fw={isActive ? 700 : 400} style={{ whiteSpace: 'nowrap' }}>{item.label}</Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </Group>
      </ScrollArea>
    </Paper>
  );
}
