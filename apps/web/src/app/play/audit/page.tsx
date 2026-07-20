import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { AuditPageClient } from './AuditPageClient';

export default function AuditPage() {
  return (
    <PageShell
      title="Net-worth audit"
      subtitle="Balance sheet, waterfall, and contribution progress for this period."
      backHref="/play/reactions"
      backLabel="Reactions"
    >
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
            Loading net-worth audit…
          </div>
        }
      >
        <AuditPageClient />
      </Suspense>
    </PageShell>
  );
}
