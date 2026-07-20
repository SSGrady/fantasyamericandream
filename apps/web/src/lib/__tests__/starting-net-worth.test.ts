import { buildInitialGameState } from '../build-game-state';
import { balanceSheetNetWorth, getDefaultV1RunConfig, type V1CharacterDraft } from '@fad/shared';
import { netWorth, waterfallReconciles } from '@fad/ledger';
import { tickSixMonthsWithSimulation, createMacroState } from '@fad/sim-engine';
import { describe, expect, it } from 'vitest';

const USER_DRAFT: V1CharacterDraft = {
  scenarioId: 'class-of-2026',
  name: 'Test Player',
  ageBand: '22',
  stateCode: 'CA',
  educationTier: 'target',
  careerSector: 'tech',
  maritalStatus: 'single',
  housingArrangement: 'solo',
  housingMode: 'rent',
  relationshipSimulation: false,
  partnerIncomeAnnual: 0,
  dependentsCount: 0,
  childrenPlanned: false,
  includeEmployerHealthPlan: true,
  habits: { deliveryFrequency: 'medium', cookingSkill: 1 },
  balanceSheet: {
    checking: 3_000_00,
    hysa: 8_700_00,
    brokerage: 0,
    rothIra: 12_000_00,
    traditional401k: 0,
    studentLoan: 0,
    creditCard: 0,
  },
  rentalSelection: {
    listingId: 'rental-CA-7',
    address: '900 Summit Place',
    neighborhood: 'Oakland Commons',
    city: 'Oakland',
    beds: 2,
    baths: 2,
    marketRentMonthly: 201_200,
  },
};

const RUN_CONFIG = getDefaultV1RunConfig();

describe('starting net worth transparency', () => {
  it('uses balance sheet only with no hidden brokerage injection', () => {
    expect(balanceSheetNetWorth(USER_DRAFT.balanceSheet)).toBe(23_700_00);

    const { gameState } = buildInitialGameState(USER_DRAFT, RUN_CONFIG);

    expect(gameState.accounts.brokerage.balance).toBe(0);
    expect(netWorth(gameState.accounts, gameState.debts)).toBe(23_700_00);
  });

  it('six-month delta reconciles with waterfall from payroll, rent, and returns', () => {
    const { gameState, deferral401kRate } = buildInitialGameState(USER_DRAFT, RUN_CONFIG);
    const startNetWorth = netWorth(gameState.accounts, gameState.debts);

    const result = tickSixMonthsWithSimulation({
      startDate: gameState.run.startDate,
      randomSeed: gameState.run.randomSeed,
      accounts: gameState.accounts,
      debts: gameState.debts,
      career: gameState.career,
      location: gameState.location,
      household: gameState.household,
      player: {
        habits: gameState.player.habits,
        includeEmployerHealthPlan: gameState.player.includeEmployerHealthPlan,
      },
      macro: createMacroState('expansion'),
      deferral401kRate,
      difficulty: gameState.run.difficulty,
    });

    expect(result.audit.startNetWorth).toBe(startNetWorth);
    expect(result.audit.startNetWorth).toBe(23_700_00);
    expect(result.audit.netWorthDelta).toBe(result.audit.netWorth - startNetWorth);
    expect(waterfallReconciles(result.audit)).toBe(true);

    const growth = result.audit.waterfall.find((line) => line.label === 'Investment returns');
    expect(growth).toBeDefined();
    expect(Math.abs(growth!.amount)).toBeGreaterThan(0);
  });
});
