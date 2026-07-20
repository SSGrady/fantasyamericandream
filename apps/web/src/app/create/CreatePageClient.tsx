'use client';

import {
  getV1StarterScenario,
  V1_AGE_BAND_OPTIONS,
  V1_CAREER_OPTIONS,
  V1_COOKING_OPTIONS,
  V1_DELIVERY_OPTIONS,
  V1_EDUCATION_OPTIONS,
  V1_MARITAL_OPTIONS,
  V1_STATE_OPTIONS,
  centsToDollars,
  dollarsToCents,
  type V1CharacterDraft,
  type V1StarterScenarioId,
} from '@fad/shared';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BalanceSheetForm } from '../../components/create/BalanceSheetForm';
import { TraitGrid } from '../../components/create/TraitGrid';
import {
  loadOrCreateCharacterDraft,
  saveCharacterDraft,
} from '../../lib/character-draft';
import { loadSelectedScenario, saveSelectedScenario } from '../../lib/scenario-session';

export function CreatePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario') as V1StarterScenarioId | null;
  const [scenarioId, setScenarioId] = useState<V1StarterScenarioId | null>(scenarioParam);
  const [draft, setDraft] = useState<V1CharacterDraft | null>(null);

  useEffect(() => {
    const resolvedScenario =
      scenarioParam ?? loadSelectedScenario() ?? ('create-your-own' as V1StarterScenarioId);

    setScenarioId(resolvedScenario);
    saveSelectedScenario(resolvedScenario);
    setDraft(loadOrCreateCharacterDraft(resolvedScenario));
  }, [scenarioParam]);

  const updateDraft = useCallback((patch: Partial<V1CharacterDraft>) => {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveCharacterDraft(next);
      return next;
    });
  }, []);

  const handleContinue = () => {
    if (!draft) return;
    saveCharacterDraft(draft);
    router.push('/create/modules');
  };

  const scenario = scenarioId ? getV1StarterScenario(scenarioId) : undefined;

  if (!draft || !scenarioId) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading character setup…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-accent">Selected scenario</p>
        {scenario ? (
          <>
            <h2 className="mt-1 font-serif text-2xl text-ink">{scenario.title}</h2>
            <p className="mt-2 text-sm text-muted">{scenario.description}</p>
          </>
        ) : (
          <h2 className="mt-1 font-serif text-2xl text-ink">{scenarioId}</h2>
        )}
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="font-serif text-xl text-ink">Name</h2>
        <p className="mt-1 text-sm text-muted">How you appear in briefings and stakeholder reactions.</p>
        <input
          type="text"
          value={draft.name}
          onChange={(event) => updateDraft({ name: event.target.value })}
          placeholder="Your name"
          maxLength={40}
          className="mt-4 w-full rounded-md border border-border bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </section>

      <TraitGrid
        label="Age band"
        description="Starting age shapes runway and career stage defaults."
        options={V1_AGE_BAND_OPTIONS}
        value={draft.ageBand}
        onChange={(ageBand) => updateDraft({ ageBand })}
        columns={4}
      />

      <TraitGrid
        label="State"
        description="Pick one of eight V0 states with distinct tax and rent profiles."
        options={V1_STATE_OPTIONS}
        value={draft.stateCode}
        onChange={(stateCode) => updateDraft({ stateCode })}
        columns={2}
      />

      <TraitGrid
        label="Education"
        description="Target vs non-target shapes recruiting difficulty and debt paths."
        options={V1_EDUCATION_OPTIONS}
        value={draft.educationTier}
        onChange={(educationTier) => updateDraft({ educationTier })}
      />

      <TraitGrid
        label="Career sector"
        description="Sector sets compensation band and layoff exposure."
        options={V1_CAREER_OPTIONS}
        value={draft.careerSector}
        onChange={(careerSector) => updateDraft({ careerSector })}
        columns={2}
      />

      <TraitGrid
        label="Marital status"
        description="Household shape for life-module simulations."
        options={V1_MARITAL_OPTIONS}
        value={draft.maritalStatus}
        onChange={(maritalStatus) =>
          updateDraft({
            maritalStatus,
            relationshipSimulation:
              maritalStatus === 'married' ? draft.relationshipSimulation : false,
            partnerIncomeAnnual: maritalStatus === 'single' ? 0 : draft.partnerIncomeAnnual,
          })
        }
      />

      {draft.maritalStatus === 'partnered' || draft.maritalStatus === 'married' ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-xl text-ink">Partner income</h2>
          <p className="mt-1 text-sm text-muted">
            Second earner W2 salary (annual, before tax). Posts as separate payroll in dual-income
            households.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-muted">$</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={centsToDollars(draft.partnerIncomeAnnual) || ''}
              onChange={(event) =>
                updateDraft({
                  partnerIncomeAnnual: dollarsToCents(Number(event.target.value) || 0),
                })
              }
              placeholder="80000"
              className="w-full max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="text-sm text-muted">/ year</span>
          </div>
        </section>
      ) : null}

      {draft.maritalStatus === 'married' ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={draft.relationshipSimulation}
              onChange={(event) =>
                updateDraft({ relationshipSimulation: event.target.checked })
              }
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span>
              <span className="block font-medium text-ink">Enable relationship simulation</span>
              <span className="mt-1 block text-sm text-muted">
                Partner reactions and joint finance events when the Life module is on.
              </span>
            </span>
          </label>
        </section>
      ) : null}

      <TraitGrid
        label="Delivery frequency"
        description="Food delivery habit affects discretionary spend baseline."
        options={V1_DELIVERY_OPTIONS}
        value={draft.habits.deliveryFrequency}
        onChange={(deliveryFrequency) =>
          updateDraft({ habits: { ...draft.habits, deliveryFrequency } })
        }
        columns={2}
      />

      <TraitGrid
        label="Cooking skill"
        description="Higher skill lowers food spend and delivery reliance."
        options={V1_COOKING_OPTIONS}
        value={draft.habits.cookingSkill}
        onChange={(cookingSkill) => updateDraft({ habits: { ...draft.habits, cookingSkill } })}
        columns={2}
      />

      <BalanceSheetForm
        value={draft.balanceSheet}
        onChange={(balanceSheet) => updateDraft({ balanceSheet })}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/scenarios"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to scenarios
        </Link>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to module toggles
        </button>
      </div>
    </div>
  );
}
