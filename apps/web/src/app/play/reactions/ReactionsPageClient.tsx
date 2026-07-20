'use client';

import { useRouter } from 'next/navigation';
import { usePlaySession } from '../../../lib/use-play-session';

const STAKEHOLDERS = [
  { name: 'Future You (35)', sentiment: 'Cautiously optimistic', note: 'Runway looks thin if rent keeps climbing.' },
  { name: 'Recruiter', sentiment: 'Neutral', note: 'Your sector still has openings, but hiring cooled.' },
  { name: 'Fee-only planner', sentiment: 'Mixed', note: 'Contribution room remains; cash buffer needs attention.' },
];

export function ReactionsPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading stakeholder reactions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Stakeholder reactions (stub)</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Competing perspectives</h2>
        <p className="mt-3 text-muted">
          T012 will add full persona cards and sentiment scoring. These placeholders keep the
          pipeline moving.
        </p>
      </div>

      <div className="space-y-3">
        {STAKEHOLDERS.map((persona) => (
          <div
            key={persona.name}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{persona.name}</h3>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                {persona.sentiment}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{persona.note}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.push('/play/audit')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to net-worth audit
        </button>
      </div>
    </div>
  );
}
