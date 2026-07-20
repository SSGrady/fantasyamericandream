import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { AnalysisPageClient } from './AnalysisPageClient';

export default function AnalysisPage() {
  return (
    <PageShell
      title="Impact analysis"
      subtitle="Fiscal, liquidity, and risk cards from your decision."
      backHref="/play/decide"
      backLabel="Decision day"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading impact analysis…
          </div>
        }
      >
        <AnalysisPageClient />
      </Suspense>
    </PageShell>
  );
}
