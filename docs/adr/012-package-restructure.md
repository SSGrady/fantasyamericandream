# ADR 012: Package Restructure for V1.5 Platform

## Status

Accepted

## Date

2026-07-20

## Context

V1.5 adds chapters, commands, Monte Carlo, and local persistence. The current `@fad/{shared,ledger,sim-engine,narrative,data}` layout works but mixes domain workflow with simulation mechanics.

## Decision

Evolve incrementally with **re-export shims** (no breaking import changes in V1.5):

| Phase | Target | Notes |
|-------|--------|-------|
| Now | `packages/domain/` | XState chapter workflow, command orchestration types |
| Now | `packages/monte-carlo/` | Worker-facing forecast API (S010) |
| Later | `packages/engine/` alias | Optional rename of sim-engine internals |
| Unchanged | `@fad/ledger` | Remains authoritative accounting package |

Public boundaries:

- `@fad/shared` - types, Zod schemas, branded money types
- `@fad/ledger` - deterministic postings only
- `@fad/sim-engine` - stochastic monthly tick, events, command scheduler
- `@fad/domain` - chapter XState machines (client-safe)
- `@fad/monte-carlo` - fan charts and goal probabilities (worker)
- `@fad/narrative` - template copy from TurnResult

Migration rule: move code behind new package paths but keep `@fad/sim-engine` re-exports until V2.

## Consequences

- S009 chapter slice imports `@fad/domain/chapter-machine`
- Dexie lives in `apps/web/src/lib/persistence/` until run sync needs shared access
- PLAN.md build order adds domain before monte-carlo UI

## Related

- [ADR 011](./011-action-command-system.md)
- [E011](../../beads/epics/E011-platform-architecture-foundation.md)
