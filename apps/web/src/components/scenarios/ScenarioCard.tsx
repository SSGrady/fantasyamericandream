import Link from 'next/link';
import type { V1StarterScenario } from '@fad/shared';

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
        'group block rounded-lg bg-card p-5 shadow-sm transition',
        'hover:shadow-md hover:ring-1 hover:ring-accent/20',
        isCustom ? 'border-2 border-dashed border-border' : 'border border-border',
      ].join(' ')}
    >
      <h2 className="font-serif text-xl text-ink group-hover:text-accent">{scenario.title}</h2>
      <p className="mt-1 text-sm font-medium text-accent">{scenario.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{scenario.description}</p>
    </Link>
  );
}
