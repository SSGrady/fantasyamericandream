import type { ReactNode } from 'react';

interface ModuleToggleSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ModuleToggleSection({ title, description, children }: ModuleToggleSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
