# ADR 002: Tech Stack - pnpm Monorepo + TypeScript

## Status

Accepted

## Date

2026-07-19

## Context

The simulator requires:

- Deterministic financial math testable in isolation
- A web UI with card-based briefing flows (V1)
- Shared types between engine and UI
- Reproducible randomness for educational replay

## Decision

Use a **pnpm monorepo** with TypeScript strict mode:

```
apps/web              @fad/web           Next.js App Router (V1+)
packages/shared       @fad/shared        Types, constants, IDs
packages/ledger       @fad/ledger        Deterministic accounting
packages/sim-engine   @fad/sim-engine    Stochastic simulation
packages/narrative    @fad/narrative     Briefing/reaction templates
packages/data         @fad/data          Calibration loaders
```

- **Testing:** Vitest in all packages; Playwright for critical UI flows (V1)
- **Styling:** Tailwind CSS in `apps/web`
- **Randomness:** Seeded PRNG injected into `sim-engine`; no unseeded `Math.random()` in simulation paths
- **Build order:** `shared → data → ledger → sim-engine → narrative → web`

## Consequences

- All financial logic lives in `packages/ledger` and `packages/sim-engine`, not in React components.
- `apps/web` is a thin client over engine APIs / local WASM-or-TS bundle (TBD in V1 ADR amendment if server-side sim is added).

## Alternatives Considered

- **Python backend + React frontend** - rejected for V0; splits test surface; user prefers TS monorepo pattern from Cineborough/DPS.
- **Single Next.js app with no packages** - rejected; ledger invariants need isolated testing without UI imports.
