# State Model

Canonical definitions for simulation state. TypeScript mirrors live in `packages/shared/src/types/`.

Money is stored as **integer cents** (`type MoneyCents = number`).

---

## SimulationRun

```typescript
interface SimulationRun {
  id: string;
  simulationVersion: string;   // semver of engine
  dataSnapshot: string;        // e.g. "2026.1"
  taxYear: number;
  randomSeed: string;
  difficulty: 'easy' | 'medium' | 'hard';
  enabledModules: string[];
  startDate: IsoDate;          // e.g. 2026-01-01
  currentDate: IsoDate;
  phase: 'active' | 'emergency' | 'ended';
  endReason?: SimulationEndReason;
}
```

## LiteracyProgress (V0 stubs)

```typescript
type LiteracySkillId =
  | 'cash_flow_i'
  | 'emergency_readiness'
  | 'credit_debt'
  | 'workplace_benefits'
  | 'investing_i'
  | 'investing_ii'
  | 'housing'
  | 'transportation'
  | 'insurance'
  | 'taxes';

interface LiteracyProgress {
  mastery: 'locked' | 'in_progress' | 'mastered';
  quizAttempts: number;
  lastAssessedAt?: string;
}
```

See `packages/shared/src/types/literacy-skills.ts` for stub definitions and default progress factory.

## PlayerState

```typescript
interface PlayerState {
  name: string;
  ageYears: number;
  birthDate: IsoDate;
  educationTier: 'target' | 'non_target' | 'graduate' | 'self_made';
  literacy: Record<LiteracySkillId, LiteracyProgress>;
  habits: {
    deliveryFrequency: 'none' | 'low' | 'medium' | 'high';
    cookingSkill: 0 | 1 | 2 | 3;
    subscriptionLoad: MoneyCents;
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}
```

## HouseholdState (V2 expands)

```typescript
interface PartnerState {
  employmentType: 'w2' | 'unemployed';
  baseSalaryAnnual: MoneyCents;
  deferral401kRate: number;
}

interface HouseholdState {
  maritalStatus: 'single' | 'partnered' | 'married';
  dependentsCount: number;
  partner?: PartnerState;
  financeMode: 'individual' | 'joint';
  relationshipHealth: number;  // 0-100, divorce inputs
}
```

`GameState.household` is required in V2 foundation (T020). V1 character draft maps `partnerIncomeAnnual` to `household.partner`.

## CareerState

```typescript
interface CareerState {
  sector: CareerSector;
  employerId?: string;
  title: string;
  employmentType: 'w2' | 'contractor' | 'unemployed' | 'student';
  baseSalaryAnnual: MoneyCents;
  bonusTargetPct?: number;
  equity?: EquityGrant[];
  tenureMonths: number;
  layoffRiskModifier: number;
  remoteArrangement: 'remote' | 'hybrid' | 'onsite';
  unemploymentWeeks: number;
  jobSearch?: JobSearchState;
}
```

## LocationState

```typescript
interface LocationState {
  stateCode: UsStateCode;
  metroId: string;
  housingMode: 'rent' | 'own';
  rentOrMortgagePayment: MoneyCents;
}
```

## Accounts (ledger-owned)

```typescript
interface Accounts {
  checking: AccountBucket;
  hysa: AccountBucket;
  traditionalSavings?: AccountBucket;
  brokerage: AccountBucket;
  rothIra: TaxAdvantagedBucket;
  traditional401k: TaxAdvantagedBucket;
  hsa?: TaxAdvantagedBucket;
  sinkingFunds: Record<string, AccountBucket>;
}
```

## Debts (ledger-owned)

```typescript
interface Debts {
  creditCards: CreditCardDebt[];
  studentLoans: TermDebt[];
  autoLoan?: TermDebt;
  mortgage?: AmortizingDebt;
  medicalDebt?: TermDebt[];
}
```

## MacroState

```typescript
interface MacroState {
  regime: MacroRegime;
  inflationAnnual: number;
  sp500ReturnYtd: number;
  mortgageRate30y: number;
  layoffClimate: number;  // multiplier on hazard
}
```

## TurnResult (sim → narrative/UI)

```typescript
interface TurnResult {
  periodStart: IsoDate;
  periodEnd: IsoDate;
  events: ResolvedEvent[];
  ledgerDelta: LedgerTransaction[];
  audit: AuditSnapshot;
  unlockedSkills: LiteracySkillId[];
  pendingDecisions: DecisionPrompt[];
}
```

## AuditSnapshot

```typescript
interface AuditSnapshot {
  netWorth: MoneyCents;
  netWorthDelta: MoneyCents;
  waterfall: NetWorthWaterfallLine[];
  savingsRate: number;
  emergencyRunwayMonths: number;
  contributionProgress: Record<string, ContributionProgress>;
}
```

---

## V0 Subset

V0 implements: `SimulationRun`, `PlayerState` (partial), `CareerState` (partial), `LocationState` (rent only), `Accounts` (core), `Debts` (CC + student), `MacroState` (basic), `TurnResult`, `AuditSnapshot`.

See [ledger invariants](./ledger-invariants.md).
