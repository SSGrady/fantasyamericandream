---
id: T005
title: Layoff + macro + market stub
status: done
type: feature
priority: P2
epic: E001
sprint: S001
depends_on: [T004]
acceptance:
  - Seeded PRNG in sim-engine
  - MacroRegime enum with expansion/recession multipliers
  - Monthly layoff hazard modifies CareerState
  - Portfolio return posts from regime distribution
  - Determinism test same seed + 12 months
---

# T005 - Layoff + Macro + Market Stub

## Description

Minimal stochastic layer: macro regime, layoff roll, market return - all proposing ledger deltas.

## Completion (2026-07-19)

- `packages/sim-engine/src/macro-regimes.ts` - regime definitions with layoff climate and return bands
- `packages/sim-engine/src/layoff.ts` - BLS baseline hazard scaled by macro, career state updates
- `packages/sim-engine/src/market-returns.ts` - regime-conditioned returns posted as `investment_return`
- `packages/sim-engine/src/tick-month.ts` - `tickMonthWithSimulation` / `tickMonthsWithSimulation` wrappers
- Golden fixture `twelve-month-determinism.json` and Vitest coverage (9 tests)
