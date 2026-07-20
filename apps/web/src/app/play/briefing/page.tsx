import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { BriefingPageClient } from './BriefingPageClient';

export default function BriefingPage() {
  return (
    <PageShell
      title="Six-month briefing"
      subtitle="Your starting job, lease, and open enrollment window."
      backHref="/create/modules"
      backLabel="Module toggles"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading briefing…
          </div>
        }
      >
        <BriefingPageClient />
      </Suspense>
    </PageShell>
  );
}
