import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { DecidePageClient } from './DecidePageClient';

export default function DecidePage() {
  return (
    <PageShell
      title="Decision day"
      subtitle="Required prompts and your open-ended action for the next six months."
      backHref="/play/briefing"
      backLabel="Briefing"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading decision day…
          </div>
        }
      >
        <DecidePageClient />
      </Suspense>
    </PageShell>
  );
}
