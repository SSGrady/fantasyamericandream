# Fantasy American Dream - Implementation Plan

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

Epic: [E002](./beads/epics/E002-v1-playable-game.md) (complete)

## V1.5: Consequence-Driven Game Loop

**Goal:** Transform "configure → calculate → read reports" into a Fantasy President Career-style loop: persistent commands, authored chapters, forensic attribution, and consequence theater.

**North star:** Players set ongoing actions on Decision Day, live through a scripted chapter with interrupts, see choice vs luck attribution, and feel stakes through editorial presentation.

| Priority | Area | Beads |
|----------|------|-------|
| P0 | Trust and metric integrity | [E004](./beads/epics/E004-trust-metric-integrity.md) / [S007](./beads/sprints/S007-trust-metric-fixes/sprint.md) |
| P1 | Action command system | [E005](./beads/epics/E005-action-command-system.md) / [S008](./beads/sprints/S008-action-commands-foundation/sprint.md) |
| P1 | Platform architecture | [E011](./beads/epics/E011-platform-architecture-foundation.md) / [S014](./beads/sprints/S014-platform-architecture/sprint.md) |
| P2 | Chapter vertical slice (CA engineer) | [E006](./beads/epics/E006-chapter-vertical-slice.md) / [S009](./beads/sprints/S009-chapter-vertical-slice/sprint.md) |
| P3 | Monte Carlo planning lab | [E007](./beads/epics/E007-monte-carlo-planning-lab.md) / [S010](./beads/sprints/S010-monte-carlo-lab/sprint.md) |
| P4 | Consequence theater and visual design | [E008](./beads/epics/E008-consequence-theater-visual-design.md) / [S011](./beads/sprints/S011-consequence-theater/sprint.md) |
| P2 | Onboarding redesign | [E009](./beads/epics/E009-onboarding-redesign.md) / [S012](./beads/sprints/S012-onboarding-redesign/sprint.md) |
| P5 | Local LLM narrative (last) | [E010](./beads/epics/E010-local-llm-narrative-layer.md) / [S013](./beads/sprints/S013-llm-narrative-layer/sprint.md) |

Requires [ADR-010 game loop and consequence pipeline](./docs/adr/010-game-loop-and-consequence-pipeline.md).

**Exit criteria:**

- One CA software engineer chapter playable end to end with commands, interrupts, and counterfactual
- Metrics trustworthy; impact analysis evaluates submitted actions
- Decision Day command center; Life Compass on dashboard
- Monte Carlo lab read-only with fan chart (skill-gated)
- Template narrative complete; LLM optional enhancement

## V1.6: Continuity Pass

**Goal:** Close the gap between "financial documents workflow" and "living through a chapter." V1.5 built the pipeline; V1.6 adds continuity, causality, and interaction density.

**North star:** One persistent chapter shell, strict chronology, canonical metrics everywhere, live planning and timeline simulation, tabbed Chapter Close.

| Priority | Area | Beads |
|----------|------|-------|
| P0 | Trust and data integrity | [E012](./beads/epics/E012-trust-data-integrity-v16.md) / [S015](./beads/sprints/S015-trust-data-integrity/sprint.md) |
| P1 | RunState and selectors | [E020](./beads/epics/E020-run-state-selector-layer.md) / S015-S016 |
| P1 | Persistent chapter shell | [E013](./beads/epics/E013-persistent-chapter-shell.md) / [S016](./beads/sprints/S016-chapter-shell/sprint.md) |
| P2 | Interactive planning | [E014](./beads/epics/E014-interactive-planning.md) / [S017](./beads/sprints/S017-interactive-planning/sprint.md) |
| P3 | Live timeline simulation | [E015](./beads/epics/E015-live-chapter-simulation.md) / [S018](./beads/sprints/S018-live-timeline-simulation/sprint.md) |
| P4 | Visual semantics and layout | [E016](./beads/epics/E016-visual-semantics-layout.md) / [S019](./beads/sprints/S019-visual-semantics-layout/sprint.md) |
| P5 | Life priorities and compass | [E017](./beads/epics/E017-life-priorities-compass.md) / [S020](./beads/sprints/S020-life-priorities-compass/sprint.md) |
| P2 | Onboarding and World Rules | [E018](./beads/epics/E018-onboarding-world-rules.md) / [S021](./beads/sprints/S021-onboarding-world-rules/sprint.md) |
| P2 | DreamHome actionability | [E019](./beads/epics/E019-dreamhome-actionability.md) / [S022](./beads/sprints/S022-dreamhome-actionability/sprint.md) |

Requires [ADR-014 chapter shell and chronology](./docs/adr/014-chapter-shell-and-chronology.md).

**Sequencing:** S015 (trust) first, then S016 (shell), then S017-S018 (plan + live sim). S019-S022 can overlap once shell exists.

**Exit criteria:**

- CA engineer chapter playable in single shell route end to end
- Chronology and attribution invariants pass CI
- Chapter Close replaces serial impact/reactions/counterfactual/audit navigation
- Plan stage has commit CTA; Live stage shows month rail with RTO interrupt
- DreamHome shows viable CA buckets with primary blocker and mini lab

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
