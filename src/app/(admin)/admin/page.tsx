'use client';

import { Stack, Text, SimpleGrid, Card, ThemeIcon } from '@mantine/core';
import { IconBarbell, IconUsers, IconCalendar, IconMessage, IconClock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';

const links = [
  { href: '/admin/workouts', label: 'אימונים', icon: IconBarbell, color: 'brand' },
  { href: '/admin/users', label: 'משתמשים', icon: IconUsers, color: 'green' },
  { href: '/admin/daily', label: 'סקירה יומית', icon: IconCalendar, color: 'orange' },
  { href: '/admin/messages', label: 'הודעות', icon: IconMessage, color: 'violet' },
  { href: '/admin/timer', label: 'טיימר', icon: IconClock, color: 'red' },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <PageContainer>
      <Stack gap="lg">
        <Text size="xl" fw={700} ta="center">ניהול</Text>
        <SimpleGrid cols={2} spacing="md">
          {links.map(({ href, label, icon: Icon, color }) => (
            <Card key={href} padding="lg" withBorder style={{ cursor: 'pointer' }} onClick={() => router.push(href)}>
              <Stack align="center" gap="sm">
                <ThemeIcon size="xl" variant="light" color={color} radius="xl">
                  <Icon size={24} />
                </ThemeIcon>
                <Text fw={500}>{label}</Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </PageContainer>
  );
}
