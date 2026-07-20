import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { DashboardPageClient } from './DashboardPageClient';

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      subtitle="Run summary and next steps after the V1 core loop."
      backHref="/play/audit"
      backLabel="Audit"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading dashboard…
          </div>
        }
      >
        <DashboardPageClient />
      </Suspense>
    </PageShell>
  );
}
