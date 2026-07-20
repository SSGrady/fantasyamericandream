'use client';

import { legacyRouteToShell } from '@fad/domain';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loadPlaySession } from './play-session';

export function LegacyPlayRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = loadPlaySession();
    if (!session) {
      router.replace('/create/modules');
      return;
    }
    const target = legacyRouteToShell(
      pathname,
      session.gameState.run.id,
      session.periodIndex + 1,
    );
    if (target) {
      router.replace(target);
    }
  }, [pathname, router]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-muted">Redirecting to chapter shell…</div>
  );
}
