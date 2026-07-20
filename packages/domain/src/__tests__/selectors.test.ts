import { describe, expect, it } from 'vitest';
import type { AuditSnapshot } from '@fad/shared';
import { createDefaultLiteracyProgress } from '@fad/shared';
import { buildChapterPeriod } from '../run-state/chapter-period.js';
import { RUN_STATE_SCHEMA_VERSION, type RunState } from '../run-state/types.js';
import {
  selectContributionProgress,
  selectLiquidRunway,
  selectNetWorth,
  selectRibbonMetrics,
} from '../selectors/metrics.js';

function mockAudit(): AuditSnapshot {
  return {
    asOf: '2026-07-01',
    startNetWorth: 50_000_00,
    netWorth: 55_000_00,
    netWorthDelta: 5_000_00,
    savingsRate: 0.1,
    emergencyRunwayMonths: 4.5,
    periodNetPayCents: 24_000_00,
    deferral401kRate: 0.1,
    cashSurplusRate: 0.02,
    waterfall: [{ label: 'Rent', amount: -12_000_00, category: 'expense' }],
    contributionProgress: {
      traditional401k: {
        contributedCents: 2_000_00,
        limitCents: 23_500_00,
        remainingCents: 21_500_00,
        pctOfLimit: 0.085,
      },
      rothIra: {
        contributedCents: 500_00,
        limitCents: 7_000_00,
        remainingCents: 6_500_00,
        pctOfLimit: 0.071,
      },
    },
  } as AuditSnapshot;
}

function mockRunState(overrides: Partial<RunState> = {}): RunState {
  const audit = mockAudit();
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
        name: 'Test',
        birthDate: '1998-06-15',
        ageYears: 28,
        educationTier: 'bachelors',
        riskTolerance: 'moderate',
        habits: { deliveryFrequency: 'low', cookingSkill: 2, subscriptionLoad: 0 },
        includeEmployerHealthPlan: true,
      },
      household: {
        maritalStatus: 'single',
        dependentsCount: 0,
      },
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
    },
    deferral401kRate: 0.1,
    startingNetWorth: 50_000_00,
    startingRothBalance: 0,
    acceptedOfferId: 'offer-sf-onsite',
    offerAccepted: true,
    chapterPeriod: buildChapterPeriod('2026-01-01', 'closed'),
    currentAudit: audit,
    impactPreview: null,
    impactPreviewCacheKey: null,
    commandDraft: [],
    commandCapacityError: null,
    pendingDecisions: [],
    playerAction: '',
    periodIndex: 1,
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
    chapterPhase: 'audit',
    activeInterrupt: null,
    chapterLessonUnlock: null,
    ...overrides,
  } as RunState;
}

describe('metric selectors', () => {
  it('selectNetWorth reads audit when present', () => {
    const state = mockRunState();
    expect(selectNetWorth(state)).toBe(55_000_00);
  });

  it('selectContributionProgress is stable across repeated reads', () => {
    const state = mockRunState();
    expect(selectContributionProgress(state)).toEqual(selectContributionProgress(state));
  });

  it('selectRibbonMetrics matches audit net worth and runway', () => {
    const state = mockRunState();
    const metrics = selectRibbonMetrics(state);
    expect(metrics.netWorth).toBe(55_000_00);
    expect(metrics.emergencyRunwayMonths).toBe(4.5);
  });
});

describe('cross-page metric parity', () => {
  it('selectors return identical values across chapter-close surfaces', () => {
    const base = mockRunState();
    const state = mockRunState({
      impactPreview: {
        baselineAudit: base.currentAudit!,
        chosenAudit: base.currentAudit!,
        deltaNetWorth: 0,
        deltaRunwayMonths: 0,
        deltaSavingsRate: 0,
        chosenDeferral401kRate: 0.1,
        isFlatPreview: true,
      },
    });
    const ribbon = selectRibbonMetrics(state);
    expect(ribbon.netWorth).toBe(selectNetWorth(state));
    expect(ribbon.emergencyRunwayMonths).toBe(selectLiquidRunway(state));
    expect(selectContributionProgress(state)).toEqual(state.currentAudit!.contributionProgress);
  });
});
