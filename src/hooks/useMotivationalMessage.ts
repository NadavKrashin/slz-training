'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getActiveMessages } from '@/lib/firebase/firestore';
import { MOTIVATIONAL_MESSAGES_SEED } from '@/lib/constants';

export function useMotivationalMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (!user || fetched.current) return;
    fetched.current = true;
    getActiveMessages()
      .then((messages) => {
        const texts =
          messages.length > 0 ? messages.map((m) => m.text) : MOTIVATIONAL_MESSAGES_SEED;
        setMessage(texts[Math.floor(Math.random() * texts.length)]);
      })
      .catch(() => {
        setMessage(
          MOTIVATIONAL_MESSAGES_SEED[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES_SEED.length)]
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { message, loading };
}
