# AGENTS.md - AI Agent Orientation

This file helps AI agents work effectively in **Life Ledger** (repo: `fantasyamericandream`).

## What This Project Is

**Life Ledger: Class of 2026** is a personal-finance life-path simulator inspired by [fantasypresidentcareer.com](https://fantasypresidentcareer.com). Players build a career starting in 2026, survive macro and household shocks, and learn financial judgment through a consequence pipeline - not trivia rewards.

Tagline: *Build a career. Survive the economy. Buy back your time.*

Full vision: [`docs/vision/product-thesis.md`](./docs/vision/product-thesis.md)  
Exhaustive feature inventory: [`docs/vision/feature-set.md`](./docs/vision/feature-set.md)

## Source of Truth

Documentation falls into three tiers, in descending order of authority:

1. **Code** - what the system actually does right now (especially `packages/ledger/` invariants).
2. **ADRs (`docs/adr/`) and schema docs (`docs/schema/`, `docs/design/`)** - durable, maintained decisions. Kept in sync with the code.
3. **Beads tickets (`beads/tickets/`)** - point-in-time work items. Frozen when closed; durable outcomes must be promoted into ADRs or schema docs.

**For AI agents:** read ADRs and schema docs **before** implementing simulation logic, ledger math, or state models. Never invent tax formulas, contribution limits, or event probabilities - they live in `docs/schema/` and `data/calibration/`. Never let the narrative/LLM layer compute money.

## Repo Layout

```
fantasyamericandream/
├── AGENTS.md                 ← you are here
├── PLAN.md                   ← phased delivery (V0 → V3)
├── apps/
│   └── web/                  ← Next.js UI (President-simulator-style flow)
├── packages/
│   ├── shared/               ← cross-package types, IDs, constants
│   ├── ledger/               ← deterministic accounting (source of financial truth)
│   ├── sim-engine/           ← stochastic life engine (events, macro, careers)
│   ├── narrative/            ← briefing/reaction copy from structured results
│   └── data/                 ← calibration loaders, tax tables, BLS anchors
├── data/
│   └── calibration/          ← versioned JSON/CSV inputs (IRS limits, state tax stubs)
├── docs/
│   ├── adr/                  ← architecture decision records
│   ├── schema/               ← state objects, ledger invariants, event schema
│   ├── design/               ← UI flow, interaction grammar
│   ├── vision/               ← product thesis, feature set, user journeys
│   └── specifications/       ← phase specs (point-in-time; promote to ADR when durable)
└── beads/
    ├── epics/                ← multi-sprint initiatives
    ├── sprints/              ← time-boxed work units
    └── tickets/              ← atomic tasks (cross-linked via frontmatter)
```

## Agent Workflow (Ledger-First)

Adapted from DPS, autodesk-dotcom-contentful-schema, and Cineborough conventions:

1. **Read before write** - Check `docs/adr/README.md` and relevant schema docs before changing state models, ledger rules, or simulation probabilities.
2. **ADR before major decisions** - New engines, pacing changes, data sources, UI interaction patterns, or scope expansions require a new ADR before implementation.
3. **Beads ticket per feature** - Create or update a ticket in `beads/tickets/` before non-trivial work. Link to epic and sprint.
4. **Ledger never lies** - All balance changes flow through `packages/ledger/`. Simulation proposes deltas; ledger applies and validates them.
5. **Narrative is downstream** - `packages/narrative/` consumes structured `TurnResult` objects. It must not mutate financial state.
6. **Update progress** - When closing a ticket: update ticket frontmatter, sprint `PROGRESS.md`, and `beads/CHANGELOG.md`.
7. **Verify before claiming done** - Run `pnpm typecheck` and `pnpm test` before marking work complete.

## Phase Gates

| Phase | Scope | Status |
|-------|-------|--------|
| **V0: Financial engine prototype** | Monthly ledger, 6-month audit, 5 careers, 8 states, rent-only, core accounts, layoff + market sim | **Current** |
| **V1: Playable game** | President-simulator UI, character creator, scenarios, impact analysis, skill tree, DreamHome lite | Planned |
| **V2: Household simulator** | Partner, children, homeownership, relocation, insurance depth, gig work | Planned |
| **V3: Platform** | 50-state system, classroom mode, shareable seeds, analytics | Planned |

Do not implement V1 UI polish or household systems in V0 unless an ADR explicitly unlocks it. See [`PLAN.md`](./PLAN.md).

## Critical Constraints

1. **Deterministic replay** - Same seed + same choices → same ledger outcome. Store `simulationVersion`, `dataSnapshot`, and `randomSeed` on every run.
2. **Monthly accounting, six-month player turns** - Engine ticks monthly; player sees audits every six months unless an interrupt event forces mid-cycle action.
3. **Knowledge unlocks tools, not luck** - Quizzes unlock analysis (PMI warnings, Monte Carlo, fee comparison). They do not boost market returns.
4. **No LLM arithmetic** - Taxes, payroll, amortization, contribution limits, and net worth are computed in TypeScript only.
5. **No hardcoded secrets** - API keys via `.env` only. See `apps/web/.env.example`.
6. **Protected characteristics** - Do not use race, religion, sex, or similar attributes as arbitrary salary or capability modifiers. Systemic scenarios must be optional, transparent, and research-grounded.
7. **Schema-first events** - Every life event is a typed object in `docs/schema/event-schema.md` before narrative copy exists.
8. **No em-dashes** - Never use em-dashes in commits, docs, or code comments. Use commas, periods, colons, or hyphen-minus (-) instead.

## Where to Find Things

| Need to... | Look here |
|---|---|
| Understand product vision | `docs/vision/product-thesis.md` |
| See full feature inventory | `docs/vision/feature-set.md` |
| See accepted architecture decisions | `docs/adr/README.md` |
| Find state object definitions | `docs/schema/state-model.md` |
| Find ledger invariants and tests | `docs/schema/ledger-invariants.md`, `packages/ledger/` |
| Find event structure | `docs/schema/event-schema.md` |
| Find UI interaction grammar | `docs/design/consequence-pipeline.md` |
| Run deterministic ledger logic | `packages/ledger/src/` |
| Run stochastic simulation | `packages/sim-engine/src/` |
| Load calibration data | `packages/data/src/`, `data/calibration/` |
| Map UI screens | `apps/web/src/` |
| Current sprint progress | `beads/sprints/` (latest `PROGRESS.md`) |
| Pick up or close work | `beads/tickets/` |
| Phased delivery plan | `PLAN.md` |

## Tech Stack Conventions

- **Framework:** Next.js (App Router) in `apps/web`
- **Language:** TypeScript strict mode throughout
- **Package manager:** pnpm workspaces
- **Testing:** Vitest in packages; Playwright for critical UI flows (V1+)
- **Styling:** Tailwind CSS
- **Randomness:** Seeded PRNG (`packages/sim-engine`); never `Math.random()` without injection

## Beads Workflow

```
Epic (beads/epics/) → Sprint (beads/sprints/) → Ticket (beads/tickets/)
```

Each ticket file uses YAML frontmatter:

```yaml
---
id: T001
title: Short title
status: open | in_progress | done | closed
type: feature | task | bug | chore | spike
priority: P1 | P2 | P3
epic: E001
sprint: S001
depends_on: []
acceptance:
  - Criterion one
---
```

When completing work:

1. Set ticket `status: done` and add a completion comment
2. Update `beads/sprints/S00X/PROGRESS.md`
3. Append entry to `beads/CHANGELOG.md`
4. Promote any durable decision into `docs/adr/` or `docs/schema/`

See [`beads/README.md`](./beads/README.md) and [ADR-006](./docs/adr/006-beads-project-tracking.md).

## Git Commits

All commits use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: subject here
```

- **Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor` (prefer `feat` / `fix` / `chore` for most work).
- **Subject length:** the message after the type must be **7 words or fewer** (not counting the type prefix).
- **Examples:** `feat: ledger invariants and types`, `chore: add project scaffold`, `fix: balance equation test`.
- **No em-dashes** in commit messages or project prose (see Critical Constraints).

## Running Locally

Project [`.npmrc`](./.npmrc) pins `registry=https://registry.npmjs.org/` so installs do not use a corporate `~/.npmrc` Artifactory default. No `@adsk` scoped packages are used in this monorepo.

If `pnpm install` hits `ERR_SOCKET_TIMEOUT` against `registry.npmjs.org`, the effective registry is already public npm; check VPN or network paths to npmjs.org (Artifactory may still work while npmjs.org is blocked). To skip user-level npm config:

```bash
NPM_CONFIG_USERCONFIG=/dev/null pnpm install
pnpm typecheck
pnpm test
pnpm dev          # starts apps/web (when UI exists)
```

## Adding Documentation

- **New ADR:** Create `docs/adr/NNN-kebab-title.md` AND update `docs/adr/README.md`.
- **New state field or invariant:** Update `docs/schema/state-model.md` or `ledger-invariants.md` AND `packages/shared/src/types/` before use.
- **New event type:** Add to `docs/schema/event-schema.md` before implementing in `sim-engine`.
- **Structural repo changes:** Update this file's Repo Layout and Where to Find Things tables.
