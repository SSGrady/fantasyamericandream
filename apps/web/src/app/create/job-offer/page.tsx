import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { JobOfferPageClient } from './JobOfferPageClient';

export default function JobOfferPage() {
  return (
    <PageShell
      title="Choose your offer"
      subtitle="Pick compensation, commute, and remote policy before starting life setup."
      backHref="/create"
      backLabel="Character setup"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading job offers…
          </div>
        }
      >
        <JobOfferPageClient />
      </Suspense>
    </PageShell>
  );
}
