import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { PlanningPageClient } from './PlanningPageClient';

export default function PlanningPage() {
  return (
    <PageShell
      title="Chapter planning"
      subtitle="Job offers and housing stakes before your six-month window."
      backHref="/play/briefing"
      backLabel="Briefing"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading planning…
          </div>
        }
      >
        <PlanningPageClient />
      </Suspense>
    </PageShell>
  );
}
