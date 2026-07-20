import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { ReactionsPageClient } from './ReactionsPageClient';

export default function ReactionsPage() {
  return (
    <PageShell
      title="Stakeholder reactions"
      subtitle="Partner, future self, recruiter, and planner perspectives."
      backHref="/play/analysis"
      backLabel="Impact analysis"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading stakeholder reactions…
          </div>
        }
      >
        <ReactionsPageClient />
      </Suspense>
    </PageShell>
  );
}
