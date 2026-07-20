import { describe, expect, it } from 'vitest';
import type { ActionCommand } from '@fad/shared';
import { createDefaultLiteracyProgress, DEFAULT_COMMAND_STATE } from '@fad/shared';
import { buildChapterPeriod, RUN_STATE_SCHEMA_VERSION, type RunState } from '@fad/domain';
import {
  canSubmitDecisionDayCommands,
  validateCommandDraftEffect,
} from '../play-session';

const deferralCommand: ActionCommand = {
  id: 'cmd-deferral',
  type: 'set_401k_deferral_rate',
  effectiveMonthKey: '2026-01',
  rate: 0.1,
};

function mockRunState(overrides: Partial<RunState> = {}): RunState {
  return {
    schemaVersion: RUN_STATE_SCHEMA_VERSION,
    gameState: {
      run: {
        id: 'run-1',
        startDate: '2026-01-01',
        currentDate: '2026-01-01',
        randomSeed: 'mock',
        phase: 'active',
        difficulty: 'medium',
        enabledModules: [],
        simulationVersion: 'test',
        dataSnapshot: 'test',
        taxYear: 2026,
      },
      player: {
        name: 'Steven',
        birthDate: '1998-06-15',
        ageYears: 28,
        educationTier: 'bachelors',
        riskTolerance: 'moderate',
        habits: { deliveryFrequency: 'low', cookingSkill: 2, subscriptionLoad: 0 },
        includeEmployerHealthPlan: true,
      },
      household: { maritalStatus: 'single', dependentsCount: 0 },
      career: {
        sector: 'tech',
        title: 'Engineer',
        employmentType: 'w2',
        baseSalaryAnnual: 120_000_00,
        tenureMonths: 12,
        unemploymentWeeks: 0,
      },
      location: {
        stateCode: 'CA',
        metroId: 'sf',
        housingMode: 'rent',
        rentPaymentMonthly: 2_000_00,
        marketRentMonthly: 2_000_00,
        housingArrangement: 'solo',
        homeValueCents: 0,
      },
      accounts: {
        checking: { id: 'checking', balance: 5_000_00 },
        hysa: { id: 'hysa', balance: 10_000_00 },
        brokerage: { id: 'brokerage', balance: 0 },
        rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
        traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
      },
      debts: { creditCards: [], studentLoans: [], mortgages: [] },
      macro: {
        regime: 'expansion',
        inflationAnnual: 0.025,
        sp500ReturnYtd: 0,
        mortgageRate30y: 0.065,
        layoffClimate: 1,
      },
      commandState: {
        ...DEFAULT_COMMAND_STATE,
        activeCommands: [deferralCommand],
      },
    },
    deferral401kRate: 0.1,
    startingNetWorth: 50_000_00,
    startingRothBalance: 0,
    acceptedOfferId: 'offer-sf-onsite',
    offerAccepted: true,
    chapterPeriod: buildChapterPeriod('2026-01-01', 'planned'),
    currentAudit: null,
    impactPreview: null,
    impactPreviewCacheKey: null,
    commandDraft: [deferralCommand],
    commandCapacityError: null,
    pendingDecisions: [],
    playerAction: '',
    periodIndex: 0,
    maxPeriods: 4,
    tickInProgress: false,
    periodHistory: [],
    endReason: null,
    endedByDemoLimit: false,
    literacyQuizAnswered: false,
    literacyProgress: createDefaultLiteracyProgress(),
    periodEvents: [],
    dreamHomeChoiceId: null,
    dreamHomeBlocked: false,
    chapterId: 'ca_engineer_2026',
    chapterPhase: 'planning',
    activeInterrupt: null,
    chapterLessonUnlock: null,
    ...overrides,
  } as RunState;
}

describe('decision day submit gate', () => {
  it('validateCommandDraftEffect is flat when draft matches committed plan', () => {
    const session = mockRunState();
    expect(validateCommandDraftEffect(session)).toEqual({
      hasEffect: false,
      reason:
        'Submitted commands match your current plan. Adjust deferrals or add a command to see a preview.',
    });
  });

  it('allows submit on planned chapter even when preview is flat', () => {
    const session = mockRunState();
    expect(canSubmitDecisionDayCommands(session)).toEqual({ ok: true });
  });

  it('blocks submit when chapter simulation is already in progress', () => {
    const session = mockRunState({
      chapterPeriod: buildChapterPeriod('2026-01-01', 'in_progress'),
    });
    expect(canSubmitDecisionDayCommands(session).ok).toBe(false);
  });

  it('blocks submit when weekly capacity is exceeded', () => {
    const session = mockRunState({
      commandCapacityError: 'Capacity exceeded: 16h of 14h weekly budget.',
    });
    expect(canSubmitDecisionDayCommands(session)).toEqual({
      ok: false,
      reason: 'Capacity exceeded: 16h of 14h weekly budget.',
    });
  });
});
