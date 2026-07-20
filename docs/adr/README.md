# Architecture Decision Records

Architecture Decision Records (ADRs) for **Life Ledger** - a personal-finance life-path simulator (Class of 2026).

---

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-project-vision-and-phasing.md) | Project Vision and Phased Delivery | Accepted | 2026-07-19 |
| [002](./002-tech-stack-monorepo.md) | Tech Stack: pnpm Monorepo + TypeScript | Accepted | 2026-07-19 |
| [003](./003-three-engine-architecture.md) | Three-Engine Architecture (Ledger, Simulation, Narrative) | Accepted | 2026-07-19 |
| [004](./004-gameplay-pacing.md) | Gameplay Pacing: Monthly Accounting, Six-Month Turns | Accepted | 2026-07-19 |
| [005](./005-state-model-and-ledger-invariants.md) | State Model and Ledger Invariants | Accepted | 2026-07-19 |
| [006](./006-beads-project-tracking.md) | Beads Project Tracking System | Accepted | 2026-07-19 |
| [007](./007-ui-consequence-pipeline.md) | UI: President-Simulator Consequence Pipeline | Accepted | 2026-07-19 |
| [008](./008-data-calibration-strategy.md) | Data Calibration and Versioned Rulesets | Accepted | 2026-07-19 |

---

## Summary

### ADR 001 - Project Vision and Phased Delivery

Life Ledger is a life-path RPG where money, career, health, relationships, geography, time, and knowledge interact. The simulator performs rigorous accounting underneath; players receive forensic six-month briefings and make the next set of decisions. Financial literacy unlocks analysis tools - not market luck.

Phases: V0 engine → V1 playable game → V2 household → V3 platform.

### ADR 002 - Tech Stack: pnpm Monorepo + TypeScript

- pnpm workspaces: `apps/web`, `packages/{shared,ledger,sim-engine,narrative,data}`
- TypeScript strict mode; Vitest for package tests
- Next.js App Router for UI (V1)
- Seeded PRNG for reproducible simulation

### ADR 003 - Three-Engine Architecture

1. **Ledger engine** (`packages/ledger/`) - exact arithmetic; sole authority on balances
2. **Simulation engine** (`packages/sim-engine/`) - probabilities, macro regimes, events
3. **Narrative engine** (`packages/narrative/`) - human-readable briefings from structured `TurnResult`

LLMs may write copy; they must never compute taxes, net worth, or contribution limits.

### ADR 004 - Gameplay Pacing

- Engine ticks **monthly** (payroll, interest, returns, rent, bills)
- Player interacts every **six months** (audit + decision day)
- **Interrupt events** (layoff, ER visit, offer deadline) can force mid-cycle decisions
- Long-term unemployment (27+ weeks) triggers Financial Emergency Mode - not instant game over

### ADR 005 - State Model and Ledger Invariants

Core state: `PlayerState`, `HouseholdState`, `CareerState`, `Accounts`, `Debts`, `MacroState`, `Skills`, `EventHistory`. Invariants: assets − liabilities = net worth; transactions balance; contribution limits enforced by tax year; replay determinism.

### ADR 006 - Beads Project Tracking

File-based epic → sprint → ticket hierarchy in `beads/`. YAML frontmatter on tickets. Progress via ticket status + sprint `PROGRESS.md` + `CHANGELOG.md`. No GitHub Issues or Jira required.

### ADR 007 - UI Consequence Pipeline

Borrow interaction grammar from Fantasy President Career:

`briefing → player decision → processing → impact analysis → stakeholder reactions → dashboard/audit`

Map political stakeholders to: partner, future self, recruiter, lender, fee-only planner, manager.

### ADR 008 - Data Calibration Strategy

Versioned rulesets (`Federal Ruleset 2026.1`, per-state stubs). Calibration from IRS, BLS, FRED, FHFA, KFF, College Scorecard, Tax Foundation. Every run stores `simulationVersion`, `dataSnapshot`, `taxYear`, `randomSeed`.
