'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stack, Text, Group, ActionIcon, Card, Badge, Divider, Button, Box, Container } from '@mantine/core';
import { IconChevronRight, IconShield, IconShieldOff, IconLock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { PageContainer } from '@/components/layout/PageContainer';
import { UserDetailSkeleton } from '@/components/ui/Skeletons';
import { CalendarGrid } from '@/components/history/CalendarGrid';
import { MonthNavigator } from '@/components/history/MonthNavigator';
import { MonthlySummary } from '@/components/history/MonthlySummary';
import { useCompletionsForUid } from '@/hooks/useCompletions';
import { useAllTimeStatsForUid } from '@/hooks/useAllTimeStatsForUid';
import { useStreakForUid } from '@/hooks/useStreakForUid';
import { useUser } from '@/hooks/useUser';
import { subscribeToUser, getWorkoutsInRange } from '@/lib/firebase/firestore';
import { setAdminClaimFn, removeAdminClaimFn } from '@/lib/firebase/functions';
import { getMonthRange, getHebrewMonthYear, getTodayDateKey } from '@/lib/dates';
import type { UserProfile } from '@/lib/types';

function UserDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get('uid') ?? '';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const { userData: currentUser } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const { start, end } = getMonthRange(year, month);

  const sharesData = profile?.shareCompletionWithAdmin ?? false;

  const { completions, loading: compLoading } = useCompletionsForUid(
    sharesData ? uid : '',
    start,
    end
  );
  const { totalCompleted, totalPosted } = useAllTimeStatsForUid(sharesData ? uid : '');
  const { currentStreak } = useStreakForUid(sharesData ? uid : '');
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = subscribeToUser(uid, (data) => {
      setProfile(data);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  useEffect(() => {
    if (!sharesData) return;
    getWorkoutsInRange(start, end).then((ws) => {
      setWorkoutDates(new Set(ws.map((w) => w.dateKey)));
    });
  }, [sharesData, start, end]);

  const todayKey = getTodayDateKey();
  const canGoNext = `${year}-${String(month + 2).padStart(2, '0')}` <= todayKey.slice(0, 7);
  const goNext = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goPrev = () => setCurrentMonth(new Date(year, month - 1, 1));

  const isSelf = currentUser?.uid === uid;
  const isTargetAdmin = profile?.role === 'admin';

  async function handleToggleRole() {
    if (!profile) return;
    setRoleLoading(true);
    try {
      if (isTargetAdmin) {
        await removeAdminClaimFn({ targetUid: uid });
        notifications.show({ message: `${profile.displayName} הוסר מתפקיד מנהל`, color: 'orange' });
      } else {
        await setAdminClaimFn({ targetUid: uid });
        notifications.show({ message: `${profile.displayName} קודם למנהל`, color: 'green' });
      }
    } catch (err: any) {
      notifications.show({ message: err?.message ?? 'שגיאה בשינוי הרשאות', color: 'red' });
    } finally {
      setRoleLoading(false);
    }
  }

  if (loading)
    return (
      <PageContainer>
        <UserDetailSkeleton />
      </PageContainer>
    );

  return (
    <PageContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon
            variant="subtle"
            aria-label="חזרה לרשימת משתמשים"
            onClick={() => router.replace('/admin/users')}
          >
            <IconChevronRight size={20} />
          </ActionIcon>
          <Text size="xl" fw={700}>
            {profile?.displayName}
          </Text>
        </Group>

        <Card>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {profile?.email}
              </Text>
              <Badge variant="light" color={profile?.role === 'admin' ? 'brand' : 'gray'}>
                {profile?.role === 'admin' ? 'מנהל' : 'משתמש'}
              </Badge>
            </Group>
            <Group>
              <Text size="sm">
                שיתוף:{' '}
                <Text component="span" fw={700}>
                  {profile?.shareCompletionWithAdmin ? 'כן' : 'לא'}
                </Text>
              </Text>
            </Group>
            {!isSelf && profile?.role !== 'guest' && (
              <Button
                size="xs"
                variant="light"
                color={isTargetAdmin ? 'orange' : 'brand'}
                leftSection={isTargetAdmin ? <IconShieldOff size={14} /> : <IconShield size={14} />}
                loading={roleLoading}
                onClick={handleToggleRole}
              >
                {isTargetAdmin ? 'הסר הרשאות מנהל' : 'הפוך למנהל'}
              </Button>
            )}
          </Stack>
        </Card>

        <Divider label="היסטוריית אימונים" />

        {!sharesData ? (
          <Card>
            <Stack align="center" gap="xs" py="md">
              <IconLock size={32} color="gray" />
              <Text c="dimmed" ta="center">
                משתמש זה לא שיתף את נתוני האימונים שלו
              </Text>
            </Stack>
          </Card>
        ) : (
          <>
            <Box
              style={{
                background: 'linear-gradient(160deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
                borderRadius: 16,
              }}
              px="md"
              py="md"
            >
              <Container size="sm" p={0}>
                <MonthNavigator
                  label={getHebrewMonthYear(currentMonth)}
                  onPrev={goPrev}
                  onNext={goNext}
                  canGoNext={canGoNext}
                />
              </Container>
            </Box>

            {compLoading ? (
              <Text c="dimmed" ta="center">
                טוען...
              </Text>
            ) : (
              <>
                <CalendarGrid
                  year={year}
                  month={month}
                  completions={completions}
                  workoutDates={workoutDates}
                />
                <MonthlySummary
                  completed={totalCompleted}
                  missed={totalPosted - totalCompleted}
                  total={totalPosted}
                  streak={currentStreak}
                />
              </>
            )}
          </>
        )}
      </Stack>
    </PageContainer>
  );
}

export function UserDetailClient() {
  return (
    <Suspense>
      <UserDetailInner />
    </Suspense>
  );
}
