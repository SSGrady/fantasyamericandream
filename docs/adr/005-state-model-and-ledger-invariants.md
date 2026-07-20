# ADR 005: State Model and Ledger Invariants

## Status

Accepted

## Date

2026-07-19

## Context

The simulator tracks careers, households, accounts, debts, insurance, location, skills, and macro state across decades. Without explicit state objects and invariants, net worth drift and non-reproducible bugs are inevitable.

## Decision

### Core state objects

| Object | Package | Responsibility |
|--------|---------|----------------|
| `SimulationRun` | shared | seed, version, enabled modules, clock |
| `PlayerState` | shared | age, skills, habits, literacy mastery |
| `HouseholdState` | shared | marital status, dependents, partner |
| `CareerState` | shared | job, comp, tenure, search status |
| `LocationState` | shared | state, metro, COL, tax jurisdiction |
| `Accounts` | ledger | all asset buckets |
| `Debts` | ledger | all liabilities |
| `InsuranceState` | sim-engine | health, dental, auto, life, disability |
| `MacroState` | sim-engine | regime, rates, inflation, layoff climate |
| `EventHistory` | sim-engine | past events, cooldowns |
| `Goals` | shared | emergency fund, Coast FIRE, wedding, etc. |

Full field definitions: [`docs/schema/state-model.md`](../schema/state-model.md)

### Ledger invariants (must always hold)

1. `netWorth = totalAssets - totalLiabilities`
2. Every transaction: sum of debits = sum of credits
3. Debt principal reduction ≤ payment allocated to principal
4. Contribution limits enforced per tax year (401k, IRA, HSA)
5. Cash cannot go negative without explicit overdraft/delinquency state
6. RSUs vest once; unvested equity excluded from liquid net worth
7. Tax accruals reconcile to taxable events on annual filing tick
8. Same seed + same player choices → identical final audit

Tests live in `packages/ledger/src/__tests__/invariants.test.ts`.

## Consequences

- Schema changes require updating `docs/schema/state-model.md` before TypeScript types.
- UI displays unvested RSU separately from liquid net worth.
- Golden-file tests for representative six-month episodes.

## Alternatives Considered

- **Single JSON blob state** - rejected; untestable, no module boundaries.
- **Floating-point money** - use integer cents (`Money` type as `bigint` or number cents) - TBD in schema; default **integer cents**.
