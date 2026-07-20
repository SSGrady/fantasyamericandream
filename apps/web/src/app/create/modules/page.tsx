import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { ModulesRedirectClient } from './ModulesRedirectClient';

export default function CreateModulesPage() {
  return (
    <PageShell
      title="World rules"
      subtitle="Module toggles now live in the character setup flow."
      backHref="/create?step=world-rules"
      backLabel="Character setup"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Opening world rules…
          </div>
        }
      >
        <ModulesRedirectClient />
      </Suspense>
    </PageShell>
  );
}
