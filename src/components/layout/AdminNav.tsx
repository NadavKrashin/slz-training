'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Box, UnstyledButton, Stack, Text, Group } from '@mantine/core';
import {
  IconBarbell,
  IconUsers,
  IconMessage,
  IconClock,
  IconLayoutDashboard,
  IconBarbellFilled,
  IconHomeFilled,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { NAV_HEIGHT } from '@/lib/constants';

const ADMIN_ITEMS = [
  { label: 'אפליקציה', icon: IconHomeFilled, iconActive: IconHomeFilled, path: '/home', exact: true },
  { label: 'ראשי', icon: IconLayoutDashboard, iconActive: IconLayoutDashboard, path: '/admin', exact: true },
  { label: 'אימונים', icon: IconBarbell, iconActive: IconBarbellFilled, path: '/admin/workouts' },
  { label: 'משתמשים', icon: IconUsers, iconActive: IconUsers, path: '/admin/users' },
  { label: 'הודעות', icon: IconMessage, iconActive: IconMessage, path: '/admin/messages' },
  { label: 'טיימר', icon: IconClock, iconActive: IconClock, path: '/admin/timer' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group justify="space-around" h={NAV_HEIGHT} px="xs">
        {ADMIN_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
          const Icon = isActive ? item.iconActive : item.icon;
          return (
            <motion.div key={item.path} whileTap={{ scale: 0.92 }} style={{ flex: 1 }}>
              <UnstyledButton
                onClick={() => router.push(item.path)}
                style={{ width: '100%' }}
              >
                <Stack align="center" gap={2} pos="relative">
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-indicator"
                      style={{
                        position: 'absolute',
                        top: -10,
                        width: 20,
                        height: 3,
                        borderRadius: 2,
                        background: 'var(--mantine-color-brand-6)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={24}
                    color={
                      isActive ? 'var(--mantine-color-brand-6)' : 'var(--mantine-color-gray-5)'
                    }
                    stroke={1.5}
                  />
                  <Text size="10px" fw={isActive ? 700 : 400} c={isActive ? 'brand.7' : 'gray.5'}>
                    {item.label}
                  </Text>
                </Stack>
              </UnstyledButton>
            </motion.div>
          );
        })}
      </Group>
    </Box>
  );
}
