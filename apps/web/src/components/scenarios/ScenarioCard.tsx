import Link from 'next/link';
import type { V1StarterScenario } from '@fad/shared';

const TENSION_LABELS: Record<V1StarterScenario['tensionTag'], string> = {
  rent_squeeze: 'Rent squeeze',
  layoff_sector: 'Layoff sector',
  debt_climb: 'Debt climb',
  benefits_gap: 'Benefits gap',
  offer_season: 'Offer season',
};

interface ScenarioCardProps {
  scenario: V1StarterScenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const href = `/create?scenario=${scenario.id}`;
  const isCustom = scenario.isCustom === true;

  return (
    <Link
      href={href}
      className={[
        'group block rounded-xl bg-card p-5 shadow-sm transition phase-enter',
        'hover:shadow-md hover:ring-1 hover:ring-accent/20',
        isCustom ? 'border-2 border-dashed border-border' : 'border border-border',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl text-ink group-hover:text-accent">{scenario.title}</h2>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
          {scenario.difficulty}/5
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-accent">{scenario.tagline}</p>
      <p className="mt-2 text-sm font-semibold text-ink">{scenario.fantasyHook}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{scenario.description}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-muted">
        {TENSION_LABELS[scenario.tensionTag]}
      </p>
    </Link>
  );
}
