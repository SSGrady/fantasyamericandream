import type {
  CareerState,
  Difficulty,
  LedgerTransaction,
  LocationState,
  SampledEventOccurrence,
  TransportationMode,
} from '@fad/shared';

function severityCostCents(
  severityId: string,
  minorCents: number,
  majorCents: number,
): number {
  return severityId === 'major' || severityId === 'sharp' ? majorCents : minorCents;
}

/** Monthly transportation cost by mode (player-facing calibration stub). */
export function transportationCostMonthly(mode: TransportationMode): number {
  switch (mode) {
    case 'car':
      return 485_00;
    case 'transit':
      return 95_00;
    case 'mixed':
      return 275_00;
    default:
      return 275_00;
  }
}

export function buildTransportationCostTransaction(
  monthKey: string,
  mode: TransportationMode,
): LedgerTransaction | null {
  const amount = transportationCostMonthly(mode);
  if (amount <= 0) return null;

  return {
    id: `tx-${monthKey}-transportation`,
    description: `Transportation (${mode})`,
    source: 'expense',
    lines: [
      { accountId: 'checking', debitCents: 0, creditCents: amount },
      { accountId: 'expense:transportation', debitCents: amount, creditCents: 0 },
    ],
  };
}

export interface EventEffectContext {
  career: CareerState;
  location: LocationState;
  difficulty: Difficulty;
}

/** Ledger postings for sampled life events (deterministic from severity id). */
export function buildEventTransactions(
  occurrence: SampledEventOccurrence,
  context: EventEffectContext,
): LedgerTransaction[] {
  const { monthKey } = occurrence;
  const transactions: LedgerTransaction[] = [];

  switch (occurrence.eventId) {
    case 'car_repair':
    case 'vehicle_repair': {
      if (context.location.transportationMode === 'transit') break;
      const cost = severityCostCents(occurrence.severityId, 650_00, 2_400_00);
      transactions.push({
        id: `tx-${monthKey}-event-${occurrence.eventId}`,
        description: 'Vehicle repair (AC, brakes, or tires)',
        source: 'expense',
        lines: [
          { accountId: 'checking', debitCents: 0, creditCents: cost },
          { accountId: 'expense:transportation', debitCents: cost, creditCents: 0 },
        ],
      });
      break;
    }
    case 'medical_er_visit':
    case 'transit_assault_er_visit': {
      const difficultyScale =
        context.difficulty === 'hard' ? 1.2 : context.difficulty === 'easy' ? 0.85 : 1;
      const base = severityCostCents(occurrence.severityId, 1_200_00, 8_500_00);
      const cost = Math.round(base * difficultyScale);
      transactions.push({
        id: `tx-${monthKey}-event-${occurrence.eventId}`,
        description: 'Emergency room visit and medical bill',
        source: 'expense',
        lines: [
          { accountId: 'checking', debitCents: 0, creditCents: cost },
          { accountId: 'expense:medical', debitCents: cost, creditCents: 0 },
        ],
      });
      break;
    }
    default:
      break;
  }

  return transactions;
}
