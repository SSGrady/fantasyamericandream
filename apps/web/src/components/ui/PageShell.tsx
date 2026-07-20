import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function PageShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel = 'Back',
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-xl text-ink hover:text-accent">
            Fantasy American Dream
          </Link>
          {backHref ? (
            <Link href={backHref} className="text-sm text-muted hover:text-accent">
              {backLabel}
            </Link>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {title ? (
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-lg text-muted">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
