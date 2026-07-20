import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { ModulesPageClient } from './ModulesPageClient';

export default function CreateModulesPage() {
  return (
    <PageShell
      title="Module toggles"
      subtitle="Configure economy, labor, life, and difficulty settings before you begin."
      backHref="/create"
      backLabel="Character setup"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading module settings…
          </div>
        }
      >
        <ModulesPageClient />
      </Suspense>
    </PageShell>
  );
}
