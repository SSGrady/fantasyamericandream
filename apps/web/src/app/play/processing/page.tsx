import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { ProcessingPageClient } from './ProcessingPageClient';

export default function ProcessingPage() {
  return (
    <PageShell title="Processing" subtitle="Simulating the impact of your decision.">
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Processing…
          </div>
        }
      >
        <ProcessingPageClient />
      </Suspense>
    </PageShell>
  );
}
