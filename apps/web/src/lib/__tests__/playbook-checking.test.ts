import { describe, expect, it } from 'vitest';
import { buildInitialGameState } from '../build-game-state';
import { getDefaultV1RunConfig, type V1CharacterDraft } from '@fad/shared';
import { tickSixMonthsWithSimulation, createMacroState } from '@fad/sim-engine';

const PLAYBOOK_DRAFT: V1CharacterDraft = {
  scenarioId: 'class-of-2026',
  name: 'Playbook',
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
  habits: { deliveryFrequency: 'low', cookingSkill: 2 },
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
    listingId: 'rental-CA-4',
    address: '500 Cedar Avenue',
    neighborhood: 'Oakland District',
    city: 'Oakland',
    beds: 2,
    baths: 1,
    marketRentMonthly: 2_012_00,
  },
};

describe('playbook checking snapshot', () => {
  it('logs six-month checking after CC autopay', () => {
    const { gameState, deferral401kRate } = buildInitialGameState(
      PLAYBOOK_DRAFT,
      getDefaultV1RunConfig(),
    );

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

    expect(result.debts.creditCards[0]?.balance).toBe(0);
    expect(result.accounts.checking.balance).toBeLessThan(30_000_00);
    expect(result.accounts.rothIra.balance).toBeGreaterThan(0);
    expect(result.audit.accountInvestmentReturns?.rothIra).toBeDefined();
  });
});
