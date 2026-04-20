'use client';

import { Skeleton, Stack, Group, SimpleGrid, Card, Box, Container } from '@mantine/core';
import { NAV_HEIGHT } from '@/lib/constants';

export function HomeSkeleton() {
  return (
    <Box pb={NAV_HEIGHT + 24}>
      {/* Hero placeholder */}
      <Skeleton
        h={200}
        radius={0}
        style={{ borderRadius: '0 0 24px 24px' }}
      />
      {/* Card placeholder */}
      <Container size="sm" px="md" pt="lg">
        <Stack gap="lg">
          <Skeleton h={160} radius="lg" />
        </Stack>
      </Container>
    </Box>
  );
}

export function HistorySkeleton() {
  return (
    <Box pb={NAV_HEIGHT + 24}>
      {/* Hero placeholder */}
      <Skeleton
        h={120}
        radius={0}
        style={{ borderRadius: '0 0 24px 24px' }}
      />
      <Container size="sm" px="md" pt="lg">
        <Stack gap="md">
          {/* Calendar grid */}
          <Card>
            <Stack gap="xs">
              <Group justify="space-around">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} circle h={32} w={32} />
                ))}
              </Group>
              {Array.from({ length: 4 }).map((_, row) => (
                <Group key={row} justify="space-around">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} circle h={32} w={32} />
                  ))}
                </Group>
              ))}
            </Stack>
          </Card>
          {/* Summary placeholder */}
          <Skeleton h={100} radius="lg" />
        </Stack>
      </Container>
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton h={28} w={120} mx="auto" radius="md" />
      <SimpleGrid cols={2} spacing="sm">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} h={80} radius="lg" />
        ))}
      </SimpleGrid>
      <Skeleton h={90} radius="lg" />
      <Skeleton h={24} w={100} radius="md" />
      <Group gap="xs" grow>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} h={56} radius="md" />
        ))}
      </Group>
      <Skeleton h={24} w={120} radius="md" />
      <Stack gap="xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} h={40} radius="sm" />
        ))}
      </Stack>
    </Stack>
  );
}

export function ProfileSkeleton() {
  return (
    <Box pb={NAV_HEIGHT + 24}>
      <Skeleton
        h={140}
        radius={0}
        style={{ borderRadius: '0 0 24px 24px' }}
      />
      <Container size="sm" px="md" pt="lg">
        <Stack gap="md">
          <Skeleton h={60} radius="lg" />
          <Skeleton h={120} radius="lg" />
          <Skeleton h={48} radius="lg" />
        </Stack>
      </Container>
    </Box>
  );
}

export function WorkoutListSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton h={28} w={100} radius="md" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} h={80} radius="lg" />
      ))}
    </Stack>
  );
}

export function UserDetailSkeleton() {
  return (
    <Stack gap="lg">
      <Group>
        <Skeleton circle h={32} w={32} />
        <Skeleton h={24} w={150} radius="md" />
      </Group>
      <Skeleton h={120} radius="lg" />
      <Skeleton h={20} w={140} radius="md" />
      <Skeleton h={300} radius="lg" />
      <Skeleton h={100} radius="lg" />
    </Stack>
  );
}

export function TimerSkeleton() {
  return (
    <Box
      style={{
        background: 'linear-gradient(160deg, #364fc7 0%, #4c6ef5 50%, #5c7cfa 100%)',
        minHeight: '100dvh',
      }}
    >
      <Stack align="center" justify="center" mih="80dvh" gap="lg">
        <Skeleton h={24} w={120} radius="md" />
        <Skeleton h={80} w={240} radius="lg" />
        <Skeleton h={16} w={180} radius="md" />
      </Stack>
    </Box>
  );
}
