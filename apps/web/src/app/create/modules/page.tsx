import Link from 'next/link';
import { PageShell } from '../../../components/ui/PageShell';

export default function CreateModulesPage() {
  return (
    <PageShell
      title="Module toggles"
      subtitle="Configure economy, labor, life, and difficulty settings before you begin."
      backHref="/create"
      backLabel="Character setup"
    >
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-ink">Module toggles coming next</h2>
        <p className="mt-3 text-muted">
          T010 will add grouped toggles for economy, labor, life, hazards, housing, health, gig
          work, tax, difficulty, and hints. Your character draft is saved in this session.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
          >
            Back to character setup
          </Link>
          <span className="inline-flex items-center justify-center rounded-md bg-surface px-5 py-2.5 text-sm text-muted">
            Begin simulation (T011)
          </span>
        </div>
      </div>
    </PageShell>
  );
}
