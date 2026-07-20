import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { PlanningLabClient } from './PlanningLabClient';

export default function PlanningLabPage() {
  return (
    <PageShell
      title="Planning lab"
      subtitle="Monte Carlo forecast and goal probabilities from your audit snapshot."
      backHref="/play/dashboard"
      backLabel="Dashboard"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading lab…
          </div>
        }
      >
        <PlanningLabClient />
      </Suspense>
    </PageShell>
  );
}
