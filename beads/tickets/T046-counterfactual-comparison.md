---
id: T046
title: Counterfactual comparison screen
status: open
type: feature
priority: P2
epic: E006
sprint: S009
depends_on:
  - T034
  - T035
acceptance:
  - After chapter sim, show chosen path vs one counterfactual (e.g. next-best offer)
  - Same seed common random numbers for fair comparison where applicable
  - Net worth, runway, time cost deltas labeled clearly
  - Screen in chapter pipeline before audit
---

# T046 - Counterfactual Comparison Screen

## Description

"What if you took Offer B?" moment. Uses attribution and impact infra from S007.

## Scope

- New play phase route
- Counterfactual tick API variant

## Grill me

- One counterfactual auto-selected, or player picks comparison target?
- Run full re-sim server-side, or precomputed branch from chapter authoring?
- Spoiler guard: hide counterfactual until after first playthrough?
