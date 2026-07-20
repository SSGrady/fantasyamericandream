'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ensurePlaySession,
  type PlaySession,
} from './play-session';

interface UsePlaySessionOptions {
  redirectTo?: string;
}

export function usePlaySession(options: UsePlaySessionOptions = {}) {
  const router = useRouter();
  const { redirectTo = '/create' } = options;
  const [session, setSession] = useState<PlaySession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = ensurePlaySession();
    if (!next) {
      router.replace(redirectTo);
      return;
    }
    setSession(next);
    setReady(true);
  }, [router, redirectTo]);

  const refresh = () => {
    const next = ensurePlaySession();
    setSession(next);
    return next;
  };

  return { session, ready, setSession, refresh };
}
