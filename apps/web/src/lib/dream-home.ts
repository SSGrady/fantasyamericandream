import type { GameState, MoneyCents, UsStateCode } from '@fad/shared';

export type DreamHomeKnowledgeMode = 'guardrails' | 'acknowledge' | 'sandbox';

export type DreamHomeBucket = 'plausible_now' | 'one_to_three_yr' | 'stretch' | 'dream';

export const DREAM_HOME_BUCKET_LABELS: Record<DreamHomeBucket, string> = {
  plausible_now: 'Plausible now',
  one_to_three_yr: '1-3 year goal',
  stretch: 'Stretch goal',
  dream: 'Dream home',
};

export interface DreamHomeListing {
  id: string;
  address: string;
  city: string;
  stateCode: UsStateCode;
  priceCents: MoneyCents;
  beds: number;
  baths: number;
  sqft: number;
  propertyTaxRate: number;
  hoaMonthlyCents: MoneyCents;
  commuteMinutes: number;
  schoolRating: number;
  bucket: DreamHomeBucket;
}

export interface AffordabilityGateResult {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  critical: boolean;
}

export interface ListingAffordability {
  listing: DreamHomeListing;
  downPaymentCents: MoneyCents;
  closingCostsCents: MoneyCents;
  moveAndFurnishCents: MoneyCents;
  cashToCloseCents: MoneyCents;
  pitiMonthlyCents: MoneyCents;
  gates: AffordabilityGateResult[];
  passCount: number;
  blockedInGuardrails: boolean;
}

const STATE_MEDIAN_PRICE: Record<UsStateCode, number> = {
  CA: 850_000_00,
  NY: 620_000_00,
  WA: 720_000_00,
  TX: 380_000_00,
  FL: 410_000_00,
  GA: 340_000_00,
  IL: 360_000_00,
  NC: 390_000_00,
  SC: 320_000_00,
  TN: 350_000_00,
};

const STATE_PROPERTY_TAX: Record<UsStateCode, number> = {
  CA: 0.0073,
  NY: 0.012,
  WA: 0.0092,
  TX: 0.018,
  FL: 0.0089,
  GA: 0.0091,
  IL: 0.021,
  NC: 0.0062,
  SC: 0.0057,
  TN: 0.0064,
};

const STREET_NAMES = [
  'Oak Lane',
  'Maple Court',
  'Cedar Street',
  'Birch Avenue',
  'Willow Drive',
  'Pine Ridge',
  'Summit View',
  'Lakefront Way',
  'Garden Path',
  'Harbor Circle',
];

function seededUnit(seed: string, index: number): number {
  let state = 0;
  const input = `${seed}:dream:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    state = (state + input.charCodeAt(i) * (i + 1)) >>> 0;
  }
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0x100000000;
}

function metroLabel(stateCode: UsStateCode): string {
  const labels: Record<UsStateCode, string> = {
    CA: 'Oakland',
    NY: 'Yonkers',
    WA: 'Tacoma',
    TX: 'Round Rock',
    FL: 'Tampa',
    GA: 'Marietta',
    IL: 'Naperville',
    NC: 'Raleigh',
    SC: 'Greenville',
    TN: 'Franklin',
  };
  return labels[stateCode];
}

function bucketForPriceRatio(ratio: number): DreamHomeBucket {
  if (ratio <= 3) return 'plausible_now';
  if (ratio <= 4.5) return 'one_to_three_yr';
  if (ratio <= 6) return 'stretch';
  return 'dream';
}

/** Target price/income ratio bands per bucket for lite mode diversity. */
const BUCKET_PRICE_FACTORS: Record<DreamHomeBucket, [number, number]> = {
  plausible_now: [0.55, 0.85],
  one_to_three_yr: [0.9, 1.25],
  stretch: [1.3, 1.65],
  dream: [1.75, 2.2],
};

export function generateDreamHomeListings(
  gameState: GameState,
  randomSeed: string,
  periodIndex: number,
): DreamHomeListing[] {
  const stateCode = gameState.location.stateCode;
  const median = STATE_MEDIAN_PRICE[stateCode];
  const annualIncome = gameState.career.baseSalaryAnnual;
  const buckets: DreamHomeBucket[] = [
    'plausible_now',
    'plausible_now',
    'one_to_three_yr',
    'one_to_three_yr',
    'stretch',
    'stretch',
    'dream',
    'dream',
    'plausible_now',
    'dream',
  ];
  const listings: DreamHomeListing[] = [];

  for (let i = 0; i < buckets.length; i += 1) {
    const bucket = buckets[i]!;
    const [minFactor, maxFactor] = BUCKET_PRICE_FACTORS[bucket];
    const unit = seededUnit(`${randomSeed}:${periodIndex}`, i);
    const factor = minFactor + unit * (maxFactor - minFactor);
    const priceCents = Math.round(median * factor);
    const priceToIncome = annualIncome > 0 ? priceCents / annualIncome : 99;
    const beds = stateCode === 'CA' || stateCode === 'NY' ? 1 + Math.floor(unit * 2) : 1 + Math.floor(unit * 3);
    const baths = 1 + Math.floor(seededUnit(randomSeed, i + 20) * (stateCode === 'CA' ? 1 : 2));
    const sqftCap = stateCode === 'CA' ? 1400 : 2200;
    const sqftFloor = stateCode === 'CA' ? 650 : 750;
    const sqft = sqftFloor + Math.floor(seededUnit(randomSeed, i + 40) * (sqftCap - sqftFloor));

    listings.push({
      id: `listing-${periodIndex}-${i}`,
      address: `${100 + i * 17} ${STREET_NAMES[i] ?? 'Main Street'}`,
      city: metroLabel(stateCode),
      stateCode,
      priceCents,
      beds,
      baths,
      sqft,
      propertyTaxRate: STATE_PROPERTY_TAX[stateCode],
      hoaMonthlyCents: unit > 0.7 ? Math.round(150_00 + unit * 350_00) : 0,
      commuteMinutes: 15 + Math.floor(seededUnit(randomSeed, i + 60) * 55),
      schoolRating: 5 + Math.floor(seededUnit(randomSeed, i + 80) * 5),
      bucket: bucketForPriceRatio(priceToIncome),
    });
  }

  return listings.sort((a, b) => a.priceCents - b.priceCents);
}

function estimatePiti(listing: DreamHomeListing, mortgageRate: number, loanCents: MoneyCents): MoneyCents {
  const monthlyRate = mortgageRate / 12;
  const months = 360;
  const principalInterest =
    monthlyRate === 0
      ? loanCents / months
      : (loanCents * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
  const propertyTax = Math.round((listing.priceCents * listing.propertyTaxRate) / 12);
  const insurance = Math.round(listing.priceCents * 0.003 / 12);
  return Math.round(principalInterest + propertyTax + insurance + listing.hoaMonthlyCents);
}

export function evaluateListingAffordability(
  listing: DreamHomeListing,
  gameState: GameState,
  knowledgeMode: DreamHomeKnowledgeMode,
): ListingAffordability {
  const mortgageRate = gameState.macro.mortgageRate30y;
  const downPct = 0.1;
  const downPaymentCents = Math.round(listing.priceCents * downPct);
  const loanCents = listing.priceCents - downPaymentCents;
  const closingCostsCents = Math.round(listing.priceCents * 0.03);
  const moveAndFurnishCents = 8_000_00;
  const cashToCloseCents = downPaymentCents + closingCostsCents + moveAndFurnishCents;
  const liquidCash = gameState.accounts.checking.balance + gameState.accounts.hysa.balance;
  const grossMonthly = gameState.career.baseSalaryAnnual / 12;
  const takeHomeMonthly = grossMonthly * 0.72;
  const pitiMonthlyCents = estimatePiti(listing, mortgageRate, loanCents);
  const monthlyDebt =
    gameState.debts.creditCards.reduce((sum, card) => sum + card.minimumPayment, 0) +
    gameState.debts.studentLoans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
  const postCloseLiquid = liquidCash - cashToCloseCents;
  const monthlyBurn = takeHomeMonthly * 0.65;
  const runwayMonths = monthlyBurn > 0 ? postCloseLiquid / monthlyBurn : 0;
  const housingRatio = takeHomeMonthly > 0 ? pitiMonthlyCents / takeHomeMonthly : 1;
  const dti = grossMonthly > 0 ? (pitiMonthlyCents + monthlyDebt) / grossMonthly : 1;
  const stressPiti = Math.round(pitiMonthlyCents * 1.15 + 7_500_00 / 12);
  const stressHousingRatio = takeHomeMonthly > 0 ? stressPiti / takeHomeMonthly : 1;

  const gates: AffordabilityGateResult[] = [
    {
      id: 'cash_to_close',
      label: 'Cash to close',
      passed: liquidCash >= cashToCloseCents,
      detail: `Need ${formatCents(cashToCloseCents)} (down, closing, move). Liquid: ${formatCents(liquidCash)}.`,
      critical: true,
    },
    {
      id: 'liquidity_remaining',
      label: 'Liquidity remaining',
      passed: postCloseLiquid >= monthlyBurn * 3,
      detail: `Post-close runway ${runwayMonths.toFixed(1)} months (target 3+).`,
      critical: true,
    },
    {
      id: 'monthly_affordability',
      label: 'Monthly affordability (28/36)',
      passed: housingRatio <= 0.28 && dti <= 0.36,
      detail: `PITI ${formatCents(pitiMonthlyCents)}/mo (${(housingRatio * 100).toFixed(0)}% of take-home). DTI ${(dti * 100).toFixed(0)}%.`,
      critical: true,
    },
    {
      id: 'stress_test',
      label: 'Stress test',
      passed: stressHousingRatio <= 0.36 && postCloseLiquid >= 7_500_00,
      detail: `+15% insurance, $7.5k repair, buffer check: ${(stressHousingRatio * 100).toFixed(0)}% housing ratio.`,
      critical: false,
    },
    {
      id: 'life_fit',
      label: 'Life fit',
      passed: listing.commuteMinutes <= 45 && listing.schoolRating >= 6,
      detail: `${listing.commuteMinutes} min commute, school rating ${listing.schoolRating}/10.`,
      critical: false,
    },
  ];

  const passCount = gates.filter((gate) => gate.passed).length;
  const criticalFails = gates.filter((gate) => gate.critical && !gate.passed);
  const blockedInGuardrails =
    knowledgeMode === 'guardrails' && criticalFails.length > 0;

  return {
    listing,
    downPaymentCents,
    closingCostsCents,
    moveAndFurnishCents,
    cashToCloseCents,
    pitiMonthlyCents,
    gates,
    passCount,
    blockedInGuardrails,
  };
}

function formatCents(cents: MoneyCents): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export interface PrimaryBlocker {
  id: string;
  label: string;
  detail: string;
  gapCents?: MoneyCents;
}

export function primaryBlockerForListing(affordability: ListingAffordability): PrimaryBlocker | null {
  const failed = affordability.gates.filter((gate) => !gate.passed);
  if (failed.length === 0) return null;

  const priority = ['cash_to_close', 'monthly_affordability', 'liquidity_remaining', 'stress_test', 'life_fit'];
  const sorted = [...failed].sort(
    (a, b) => priority.indexOf(a.id) - priority.indexOf(b.id),
  );
  const primary = sorted[0]!;

  if (primary.id === 'cash_to_close') {
    const liquid = affordability.listing.priceCents * 0.1 + affordability.closingCostsCents;
    const gap = Math.max(0, affordability.cashToCloseCents - liquid);
    return {
      id: primary.id,
      label: 'Down payment & closing cash',
      detail: primary.detail,
      gapCents: gap > 0 ? gap : undefined,
    };
  }
  if (primary.id === 'monthly_affordability') {
    return {
      id: primary.id,
      label: 'Monthly payment (DTI / 28%)',
      detail: primary.detail,
    };
  }
  if (primary.id === 'liquidity_remaining') {
    return {
      id: primary.id,
      label: 'Cash reserve after close',
      detail: primary.detail,
    };
  }

  return { id: primary.id, label: primary.label, detail: primary.detail };
}

/** Deterministic 0-100 score from gate pass rate and bucket tier. */
export function affordabilityProbability(affordability: ListingAffordability): number {
  const base = (affordability.passCount / affordability.gates.length) * 100;
  const bucketPenalty: Record<DreamHomeBucket, number> = {
    plausible_now: 0,
    one_to_three_yr: 12,
    stretch: 28,
    dream: 45,
  };
  return Math.max(5, Math.min(95, Math.round(base - bucketPenalty[affordability.listing.bucket])));
}

export function knowledgeModeFromHints(hintsEnabled: boolean): DreamHomeKnowledgeMode {
  return hintsEnabled ? 'guardrails' : 'sandbox';
}
