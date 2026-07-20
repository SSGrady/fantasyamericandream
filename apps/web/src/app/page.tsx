import Link from 'next/link';
import { PageShell } from '../components/ui/PageShell';

export default function HomePage() {
  return (
    <PageShell>
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Class of 2026</p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Fantasy American Dream</h1>
        <p className="mt-4 text-xl text-muted">
          Build a career. Survive the economy. Buy back your time.
        </p>
        <div className="mt-8">
          <Link
            href="/scenarios"
            className="inline-flex items-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent/90"
          >
            Choose your scenario
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
