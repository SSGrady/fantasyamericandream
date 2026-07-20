---
id: T029
title: Contribution vs return attribution
status: done
type: feature
priority: P1
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Audit waterfall separates contribution inflows from investment returns by account bucket
  - Period attribution sums to net-worth delta within rounding tolerance
  - Analysis page shows contribution vs return split, not blended growth line
  - Structured TurnResult field for narrative consumption
---

# T029 - Contribution vs Return Attribution

## Description

North-star moment requires showing "$2,800 from contributions, $400 from market growth." Extend audit snapshot with per-period attribution by source.

## Scope

- `packages/ledger/src/audit.ts`
- `packages/shared/src/types/turn-result.ts`
- Impact/analysis UI

## Grill me

- Attribute employer 401k match as contribution or separate "employer benefit" line?
- Include HYSA interest as return or as passive income category?
- Show attribution at account level or rolled up to net worth only?
