import { buildV0ScenarioFixture, MORTGAGE_RATES_2026 } from '@fad/data';
import { CA_ENGINEER_2026, deferralRateFromOffer, resolveJobOffer } from '@fad/domain';
import { computeMortgagePitiStub } from '@fad/ledger';
import {
  buildHouseholdFromDraft,
  defaultHousingArrangement,
  enabledModulesFromV1RunConfig,
  isHousingArrangementAllowed,
  playerRentShare,
  type GameState,
  type HousingMode,
  type IsoDate,
  type MacroState,
  type V1CharacterDraft,
  type V1HousingArrangement,
  type V1RunConfig,
  DEFAULT_COMMAND_STATE,
} from '@fad/shared';

const SIMULATION_VERSION = 'v0.1.0';
const DATA_SNAPSHOT = 'calibration-2026';

const DEFAULT_MACRO: MacroState = {
  regime: 'expansion',
  inflationAnnual: 0.025,
  sp500ReturnYtd: 0,
  mortgageRate30y: 0.065,
  layoffClimate: 1,
};

function birthDateForAgeBand(ageBand: V1CharacterDraft['ageBand']): IsoDate {
  const age = Number(ageBand);
  const birthYear = 2026 - age;
  return `${birthYear}-06-15` as IsoDate;
}

function deterministicSeed(draft: V1CharacterDraft): string {
  return `v1-${draft.scenarioId}-${draft.careerSector}-${draft.stateCode}-${draft.name.trim() || 'anon'}`;
}

/** Stub home value when switching to own: 200x monthly market rent. */
function stubHomeValueFromRent(marketRentMonthly: number): number {
  return Math.round(marketRentMonthly * 200);
}

export interface InitialPlaySetup {
  gameState: GameState;
  deferral401kRate: number;
  startingRothBalance: number;
  acceptedOfferId: string;
}

export function buildInitialGameState(
  draft: V1CharacterDraft,
  config: V1RunConfig,
): InitialPlaySetup {
  const fixture = buildV0ScenarioFixture({
    id: `${draft.careerSector}_${draft.stateCode.toLowerCase()}`,
    career: draft.careerSector,
    stateCode: draft.stateCode,
    randomSeed: deterministicSeed(draft),
  });

  const chapter = CA_ENGINEER_2026;
  const offerSelection = draft.jobOfferSelection ?? { offerId: chapter.defaultOfferId };
  const jobOffer = resolveJobOffer(
    chapter,
    offerSelection.offerId,
    offerSelection.custom,
  );
  const deferral401kRate = deferralRateFromOffer(jobOffer);

  const accounts = {
    checking: { id: 'checking', balance: draft.balanceSheet.checking },
    hysa: { id: 'hysa', balance: draft.balanceSheet.hysa },
    brokerage: { id: 'brokerage', balance: draft.balanceSheet.brokerage },
    rothIra: {
      id: 'roth',
      balance: draft.balanceSheet.rothIra,
      taxYearContributions: 0,
    },
    traditional401k: {
      id: '401k',
      balance: draft.balanceSheet.traditional401k,
      taxYearContributions: 0,
    },
    plan529: {
      id: '529',
      balance: 0,
      taxYearContributions: 0,
    },
  };

  const creditBalance = draft.balanceSheet.creditCard;
  const loanPrincipal = draft.balanceSheet.studentLoan;

  const housingMode: HousingMode = draft.housingMode ?? 'rent';
  const housingArrangement: V1HousingArrangement = isHousingArrangementAllowed(
    draft.housingArrangement,
    draft.maritalStatus,
  )
    ? draft.housingArrangement
    : defaultHousingArrangement(draft.maritalStatus);

  const marketRentMonthly =
    draft.rentalSelection?.marketRentMonthly ?? fixture.location.marketRentMonthly;
  const playerRentShareMonthly =
    housingMode === 'rent' ? playerRentShare(marketRentMonthly, housingArrangement) : 0;

  const homeValueCents =
    housingMode === 'own' ? stubHomeValueFromRent(marketRentMonthly) : undefined;
  const mortgageStub =
    housingMode === 'own' && homeValueCents
      ? computeMortgagePitiStub({
          homeValueCents,
          apr: MORTGAGE_RATES_2026.baseRate,
        })
      : null;

  const debts = {
    creditCards: [
      {
        id: 'cc1',
        balance: creditBalance,
        limit: Math.max(creditBalance * 2, 500_00),
        apr: 0.2199,
        minimumPayment: Math.max(Math.round(creditBalance * 0.02), 25_00),
      },
    ],
    studentLoans: [
      {
        id: 'sl1',
        principal: loanPrincipal,
        apr: 0.055,
        minimumPayment: Math.max(Math.round(loanPrincipal * 0.011), 28_00),
      },
    ],
    mortgages: mortgageStub
      ? [
          {
            id: 'mtg1',
            principal: mortgageStub.principal,
            homeValue: homeValueCents!,
            apr: MORTGAGE_RATES_2026.baseRate,
            termMonths: 360,
            monthlyPiti: mortgageStub.monthlyPiti,
            pmiMonthly: mortgageStub.pmiMonthly,
          },
        ]
      : [],
  };

  const gameState: GameState = {
    run: {
      id: `run-${deterministicSeed(draft)}`,
      simulationVersion: SIMULATION_VERSION,
      dataSnapshot: DATA_SNAPSHOT,
      taxYear: 2026,
      randomSeed: fixture.config.randomSeed,
      difficulty: config.difficulty,
      enabledModules: enabledModulesFromV1RunConfig(config),
      startDate: fixture.startDate,
      currentDate: fixture.startDate,
      phase: 'active',
    },
    player: {
      name: draft.name.trim() || 'Player',
      ageYears: Number(draft.ageBand),
      birthDate: birthDateForAgeBand(draft.ageBand),
      educationTier: draft.educationTier,
      habits: {
        deliveryFrequency: draft.habits.deliveryFrequency,
        cookingSkill: draft.habits.cookingSkill,
        subscriptionLoad: 0,
      },
      includeEmployerHealthPlan: draft.includeEmployerHealthPlan,
      riskTolerance: 'moderate',
    },
    career: {
      ...fixture.career,
      title: jobOffer.title,
      baseSalaryAnnual: jobOffer.baseSalaryAnnual,
    },
    household: buildHouseholdFromDraft({
      maritalStatus: draft.maritalStatus,
      partnerIncomeAnnual: draft.partnerIncomeAnnual,
      dependentsCount: draft.dependentsCount,
    }),
    location: {
      ...fixture.location,
      housingMode,
      transportationMode: draft.transportationMode ?? 'mixed',
      marketRentMonthly,
      rentPaymentMonthly: playerRentShareMonthly,
      housingArrangement,
      homeValueCents,
    },
    accounts,
    debts,
    macro: { ...DEFAULT_MACRO },
    commandState: { ...DEFAULT_COMMAND_STATE },
  };

  return {
    gameState,
    deferral401kRate,
    startingRothBalance: draft.balanceSheet.rothIra,
    acceptedOfferId: jobOffer.id,
  };
}
