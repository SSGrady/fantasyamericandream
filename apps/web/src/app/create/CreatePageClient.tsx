'use client';

import {
  getV1StarterScenario,
  MAX_DEPENDENTS_COUNT,
  V1_AGE_BAND_OPTIONS,
  V1_CAREER_OPTIONS,
  V1_COOKING_OPTIONS,
  V1_DELIVERY_OPTIONS,
  V1_EDUCATION_OPTIONS,
  V1_MARITAL_OPTIONS,
  V1_STATE_OPTIONS,
  V1_TRANSPORTATION_OPTIONS,
  centsToDollars,
  defaultHousingArrangement,
  dollarsToCents,
  housingOptionsForMaritalStatus,
  isHousingArrangementAllowed,
  type V1CharacterDraft,
  type V1StarterScenarioId,
  type LifePriorityId,
} from '@fad/shared';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BalanceSheetForm } from '../../components/create/BalanceSheetForm';
import { CharacterSetupWizard } from '../../components/create/CharacterSetupWizard';
import { OnboardingPreviewRail } from '../../components/create/OnboardingPreviewRail';
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
  const [step, setStep] = useState(1);

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
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    saveCharacterDraft(draft);
    router.push('/create/job-offer');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }
    router.push('/scenarios');
  };

  const scenario = scenarioId ? getV1StarterScenario(scenarioId) : undefined;
  const advanced = draft?.setupMode === 'advanced';

  const LIFE_PRIORITIES: { id: LifePriorityId; label: string }[] = [
    { id: 'wealth', label: 'Wealth' },
    { id: 'freedom', label: 'Freedom' },
    { id: 'stability', label: 'Stability' },
    { id: 'experience', label: 'Experience' },
    { id: 'family', label: 'Family' },
  ];

  if (!draft || !scenarioId) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading character setup…
      </div>
    );
  }

  return (
    <CharacterSetupWizard
      step={step}
      onStepChange={setStep}
      preview={<OnboardingPreviewRail draft={draft} step={step} />}
    >
      {step === 1 ? (
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
          <div className="mt-4">
            <Link href="/scenarios" className="text-sm font-medium text-accent hover:underline">
              Change scenario
            </Link>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <>
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="font-serif text-xl text-ink">Setup mode</h2>
        <p className="mt-1 text-sm text-muted">
          Slim starts with scenario defaults. Advanced exposes full balance sheet and household fields.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['slim', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => updateDraft({ setupMode: mode })}
              className={`rounded-md border px-4 py-2 text-sm font-medium capitalize ${
                draft.setupMode === mode
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-ink'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="font-serif text-xl text-ink">Life priorities</h2>
        <p className="mt-1 text-sm text-muted">Pick up to three priorities that shape briefing tone.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {LIFE_PRIORITIES.map((priority) => {
            const selected = draft.lifePriorities?.includes(priority.id) ?? false;
            return (
              <button
                key={priority.id}
                type="button"
                onClick={() => {
                  const current = draft.lifePriorities ?? [];
                  const next = selected
                    ? current.filter((id) => id !== priority.id)
                    : current.length >= 3
                      ? current
                      : [...current, priority.id];
                  updateDraft({ lifePriorities: next });
                }}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                  selected ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-ink'
                }`}
              >
                {priority.label}
              </button>
            );
          })}
        </div>
      </section>

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
        onChange={(maritalStatus) => {
          const housingArrangement = isHousingArrangementAllowed(
            draft.housingArrangement,
            maritalStatus,
          )
            ? draft.housingArrangement
            : defaultHousingArrangement(maritalStatus);
          updateDraft({
            maritalStatus,
            housingArrangement,
            relationshipSimulation:
              maritalStatus === 'married' ? draft.relationshipSimulation : false,
            partnerIncomeAnnual: maritalStatus === 'single' ? 0 : draft.partnerIncomeAnnual,
            childrenPlanned: maritalStatus === 'single' ? draft.childrenPlanned : false,
            dependentsCount:
              maritalStatus === 'single' && !draft.childrenPlanned ? 0 : draft.dependentsCount,
          });
        }}
      />

      <TraitGrid
        label="Transportation"
        description="Car ownership vs transit affects monthly costs and hazard events."
        options={V1_TRANSPORTATION_OPTIONS}
        value={draft.transportationMode ?? 'mixed'}
        onChange={(transportationMode) => updateDraft({ transportationMode })}
        columns={3}
      />

      <TraitGrid
        label="Housing arrangement"
        description="How you split market rent and utilities. Your share posts to expense:rent each month."
        options={housingOptionsForMaritalStatus(draft.maritalStatus)}
        value={draft.housingArrangement}
        onChange={(housingArrangement) => updateDraft({ housingArrangement })}
        columns={2}
      />

      {draft.maritalStatus === 'single' ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={draft.childrenPlanned ?? false}
              onChange={(event) =>
                updateDraft({
                  childrenPlanned: event.target.checked,
                  dependentsCount: event.target.checked ? Math.max(1, draft.dependentsCount) : 0,
                })
              }
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span>
              <span className="block font-medium text-ink">Children planned</span>
              <span className="mt-1 block text-sm text-muted">
                Model future dependents and childcare costs before starting a household.
              </span>
            </span>
          </label>
        </section>
      ) : null}

      {draft.maritalStatus !== 'single' ||
      (draft.maritalStatus === 'single' && draft.childrenPlanned) ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-xl text-ink">Dependents</h2>
          <p className="mt-1 text-sm text-muted">
            Number of children or dependents. Each posts $800/mo childcare in the household stub.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: MAX_DEPENDENTS_COUNT + 1 }, (_, count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateDraft({ dependentsCount: count })}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  draft.dependentsCount === count
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-surface text-ink hover:border-accent/40'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </section>
      ) : null}

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
              checked={draft.relationshipSimulation ?? false}
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

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={draft.includeEmployerHealthPlan ?? true}
            onChange={(event) =>
              updateDraft({ includeEmployerHealthPlan: event.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span>
            <span className="block font-medium text-ink">Include employer health plan</span>
            <span className="mt-1 block text-sm text-muted">
              Posts a $140/mo single-coverage premium stub when employed W2. Turn off for
              marketplace or uninsured scenarios.
            </span>
          </span>
        </label>
      </section>
        </>
      ) : null}

      {step === 3 ? (
        <>
      <BalanceSheetForm
        value={draft.balanceSheet}
        onChange={(balanceSheet) => updateDraft({ balanceSheet })}
      />

      {advanced ? null : (
        <p className="text-sm text-muted">
          Balance sheet uses scenario defaults in slim mode. Switch to Advanced on step 2 to edit household fields.
        </p>
      )}
        </>
      ) : null}

      {step === 4 ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-xl text-ink">World rules</h2>
          <p className="mt-2 text-sm text-muted">
            Module presets (Guided, Realistic, Volatile, Harsh) set macro and hazard toggles. You can
            fine-tune on the next screen; defaults favor Guided for first-time players.
          </p>
          <Link
            href="/create/modules"
            className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
          >
            Open world rules & module toggles
          </Link>
        </section>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          {step === 1 ? 'Back to scenarios' : 'Back'}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          {step === 4 ? 'Continue to job offers' : 'Next step'}
        </button>
      </div>
    </CharacterSetupWizard>
  );
}
