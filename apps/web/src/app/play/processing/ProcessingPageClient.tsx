'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePlaySession } from '../../../lib/use-play-session';

export function ProcessingPageClient() {
  const router = useRouter();
  const { ready } = usePlaySession();

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      router.replace('/play/analysis');
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [ready, router]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="mt-4 font-serif text-xl text-ink">Analyzing impact…</p>
      <p className="mt-2 text-sm text-muted">
        Running consequence pipeline on your decision (stub until T012).
      </p>
    </div>
  );
}
