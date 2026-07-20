import type { HouseholdState, LedgerTransaction, MoneyCents } from '@fad/shared';

/** Legal fees stub at separation filing. */
export const DIVORCE_LEGAL_FEES_CENTS = 5_000_00;

export interface DivorceFalloutInput {
  monthKey: string;
  severityId: 'moderate' | 'contested';
  /** Joint liquid assets before split (checking + brokerage). */
  jointLiquidAssetsCents: MoneyCents;
}

export interface DivorceFalloutResult {
  transactions: LedgerTransaction[];
  alimonyMonthlyCents: MoneyCents;
  playerAssetShareCents: MoneyCents;
}

/** Deterministic asset split and alimony band from severity (stub, not RNG). */
export function computeDivorceFallout(input: DivorceFalloutInput): DivorceFalloutResult {
  const playerSharePct = input.severityId === 'contested' ? 0.45 : 0.5;
  const playerAssetShareCents = Math.round(input.jointLiquidAssetsCents * playerSharePct);
  const assetTransferCents = input.jointLiquidAssetsCents - playerAssetShareCents;
  const alimonyMonthlyCents = input.severityId === 'contested' ? 1_500_00 : 800_00;

  const transactions: LedgerTransaction[] = [
    {
      id: `tx-${input.monthKey}-divorce-legal`,
      description: 'Divorce legal fees',
      source: 'expense',
      lines: [
        { accountId: 'expense:legal', debitCents: DIVORCE_LEGAL_FEES_CENTS, creditCents: 0 },
        { accountId: 'checking', debitCents: 0, creditCents: DIVORCE_LEGAL_FEES_CENTS },
      ],
    },
  ];

  if (assetTransferCents > 0) {
    transactions.push({
      id: `tx-${input.monthKey}-divorce-asset-split`,
      description: 'Asset division to partner',
      source: 'expense',
      lines: [
        { accountId: 'expense:legal', debitCents: assetTransferCents, creditCents: 0 },
        { accountId: 'checking', debitCents: 0, creditCents: assetTransferCents },
      ],
    });
  }

  return {
    transactions,
    alimonyMonthlyCents,
    playerAssetShareCents,
  };
}

export function buildAlimonyTransaction(
  monthKey: string,
  alimonyMonthlyCents: MoneyCents,
): LedgerTransaction | null {
  if (alimonyMonthlyCents <= 0) {
    return null;
  }

  return {
    id: `tx-${monthKey}-alimony`,
    description: 'Alimony payment',
    source: 'expense',
    lines: [
      { accountId: 'expense:legal', debitCents: alimonyMonthlyCents, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: alimonyMonthlyCents },
    ],
  };
}

export function householdEligibleForDivorce(household: HouseholdState): boolean {
  return household.maritalStatus === 'partnered' || household.maritalStatus === 'married';
}
