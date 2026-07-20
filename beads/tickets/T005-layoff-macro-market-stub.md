---
id: T005
title: Layoff + macro + market stub
status: open
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
