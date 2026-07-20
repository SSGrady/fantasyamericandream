import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { EndPageClient } from './EndPageClient';

export default function EndPage() {
  return (
    <PageShell
      title="Final report"
      subtitle="Ending net worth, savings rate, and replay seed."
      backHref="/play/dashboard"
      backLabel="Dashboard"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading final report…
          </div>
        }
      >
        <EndPageClient />
      </Suspense>
    </PageShell>
  );
}
