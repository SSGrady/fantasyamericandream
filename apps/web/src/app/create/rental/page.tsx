import { Suspense } from 'react';
import { PageShell } from '../../../components/ui/PageShell';
import { RentalPickerPageClient } from './RentalPickerPageClient';

export default function CreateRentalPage() {
  return (
    <PageShell
      title="Find a rental"
      subtitle="Browse synthetic listings calibrated to your state and pick a lease before the simulation starts."
      backHref="/create/modules"
      backLabel="Module toggles"
    >
      <Suspense
        fallback={
          <div className="rounded-xl bg-card p-6 text-muted ring-1 ring-border/60">
            Loading rental listings…
          </div>
        }
      >
        <RentalPickerPageClient />
      </Suspense>
    </PageShell>
  );
}
