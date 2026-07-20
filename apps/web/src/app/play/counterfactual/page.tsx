import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { CounterfactualPageClient } from './CounterfactualPageClient';

export default function CounterfactualPage() {
  return (
    <PageShell
      title="Counterfactual"
      subtitle="Chosen path vs alternate offer from this chapter."
      backHref="/play/reactions"
      backLabel="Reactions"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading counterfactual…
          </div>
        }
      >
        <CounterfactualPageClient />
      </Suspense>
    </PageShell>
  );
}
