import { Suspense } from 'react';
import { PageShell } from '../../components/ui/PageShell';
import { CreatePageClient } from './CreatePageClient';

export default function CreatePage() {
  return (
    <PageShell
      title="Character setup"
      subtitle="Define your starting life. Full creator arrives in the next sprint ticket."
      backHref="/scenarios"
      backLabel="Scenarios"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading scenario…
          </div>
        }
      >
        <CreatePageClient />
      </Suspense>
    </PageShell>
  );
}
