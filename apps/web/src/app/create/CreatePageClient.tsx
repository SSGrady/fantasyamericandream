'use client';

import { getV1StarterScenario, type V1StarterScenarioId } from '@fad/shared';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { saveSelectedScenario } from '../../lib/scenario-session';

export function CreatePageClient() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario') as V1StarterScenarioId | null;
  const [scenarioId, setScenarioId] = useState<V1StarterScenarioId | null>(scenarioParam);

  useEffect(() => {
    if (scenarioParam) {
      setScenarioId(scenarioParam);
      saveSelectedScenario(scenarioParam);
    }
  }, [scenarioParam]);

  const scenario = scenarioId ? getV1StarterScenario(scenarioId) : undefined;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {scenario ? (
        <>
          <p className="text-sm font-medium text-accent">Selected scenario</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">{scenario.title}</h2>
          <p className="mt-2 text-muted">{scenario.description}</p>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl text-ink">Character setup</h2>
          <p className="mt-2 text-muted">
            Choose a scenario from the list to begin character setup.
          </p>
        </>
      )}

      <p className="mt-6 rounded-md bg-surface px-4 py-3 text-sm text-muted">
        Character creator coming in T009. Trait grids, balance sheet, and module toggles will
        live here.
      </p>
    </div>
  );
}
