'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { worldRulesDeepLink } from '../../../lib/world-rules-url';

export function ModulesRedirectClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace(worldRulesDeepLink({ openModules: true }));
  }, [router]);

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
      Opening world rules…
    </div>
  );
}
