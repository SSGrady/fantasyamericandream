'use client';

import { enabledModulesFromV1RunConfig } from '@fad/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadCharacterDraft } from '../../../lib/character-draft';
import { loadRunConfig } from '../../../lib/run-config';

export function BriefingPageClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [moduleCount, setModuleCount] = useState(0);

  useEffect(() => {
    const draft = loadCharacterDraft();
    const config = loadRunConfig();
    if (!draft || !config) {
      router.replace('/create');
      return;
    }
    setModuleCount(enabledModulesFromV1RunConfig(config).length);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading briefing…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">H1 2026 briefing</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">First briefing coming in T011</h2>
        <p className="mt-3 text-muted">
          Your character draft and run config ({moduleCount} enabled modules) are saved for this
          session. T011 will add the metrics ribbon, narrative, and decision-day navigation.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/create/modules"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to module toggles
        </Link>
        <span className="inline-flex items-center justify-center rounded-md bg-surface px-5 py-2.5 text-sm text-muted">
          Decision day (T011)
        </span>
      </div>
    </div>
  );
}
