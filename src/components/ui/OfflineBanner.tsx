'use client';

import { Alert } from '@mantine/core';
import { IconWifiOff } from '@tabler/icons-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <Alert
      icon={<IconWifiOff size={18} />}
      color="yellow"
      radius={0}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}
    >
      אין חיבור לאינטרנט. חלק מהנתונים עשויים להיות לא עדכניים.
    </Alert>
  );
}
