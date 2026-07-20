# Life Ledger - Implementation Plan

Phased delivery for the Class of 2026 personal-finance life simulator.

## Assumptions

- Solo/personal project with AI agent assistance
- Ledger-first: V0 proves accounting before UI polish
- President-simulator interaction grammar (briefing → decision → analysis → reactions → audit)
- Schema-first: state and events defined in `docs/schema/` before simulation code
- Beads tracking in `beads/` (no external Jira)

## V0: Financial Engine Prototype

**Goal:** Prove monthly ledger + six-month audit loop with seeded replay.

| Step | Deliverable | Beads |
|------|-------------|-------|
| 0.1 | Repo scaffold (AGENTS, ADRs, beads, packages) | T001 |
| 0.2 | Shared state types + ledger invariants | T002 |
| 0.3 | Monthly payroll, tax withholding, account postings | T003 |
| 0.4 | Six-month tick + audit snapshot | T004 |
| 0.5 | Layoff hazard + job-search stub + market returns | T005 |

**Exit criteria:**

- One character, age 22–30, single, rent-only, 8 states, 5 careers
- Accounts: checking, HYSA, 401(k), Roth IRA, brokerage; debts: CC + student loan
- Monthly ledger balances; six-month audit JSON
- Same seed + choices → identical net worth
- 20 event stubs + 10 literacy lesson stubs defined in schema

Epic: [E001](./beads/epics/E001-v0-financial-engine.md) / Sprint: [S001](./beads/sprints/S001-v0-scaffold/sprint.md)

## V1: Playable Game

**Goal:** Shippable web experience with President-simulator-style UI.

| Area | Deliverables |
|------|--------------|
| Onboarding | Scenario picker, character creator, module toggles |
| Core loop | Briefing, decision day, impact analysis, reactions, NW audit |
| Content | 30–50 events, skill tree v1, DreamHome lite (10 listings) |
| Endings | Coast FIRE, age 65, insolvency, voluntary exit, final report |

Requires [ADR-007 UI interaction pattern](./docs/adr/007-ui-consequence-pipeline.md).

## V2: Household Simulator

Partner income, children, homeownership, relocation, term life, disability, dental, pets, gig work, divorce toggle, full state tax tables.

## V3: Platform

50-state coverage, scenario creator, teacher dashboard, shareable seeded challenges, learning analytics.

## Package Build Order

```
shared → data → ledger → sim-engine → narrative → web
```

## File Targets (V0)

```
packages/ledger/src/
├── index.ts
├── ledger.ts              # apply transactions, enforce invariants
├── payroll.ts             # gross → net
├── accounts.ts            # contribution limits
└── __tests__/invariants.test.ts

packages/sim-engine/src/
├── index.ts
├── tick-month.ts
├── tick-half-year.ts
├── macro-regimes.ts
└── events/

packages/shared/src/types/
├── player-state.ts
├── accounts.ts
├── turn-result.ts
└── simulation-run.ts
```
