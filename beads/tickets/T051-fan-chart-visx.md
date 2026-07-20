---
id: T051
title: Fan chart visx component
status: open
type: feature
priority: P2
epic: E007
sprint: S010
depends_on:
  - T050
acceptance:
  - Fan chart (percentile bands) for net worth over horizon using visx
  - Responsive layout; accessible labels and reduced-motion safe
  - Hooks to forecast worker output percentiles by month
  - Story or play route demo with fixture data
---

# T051 - Fan Chart visx Component

## Description

Visualize forecast uncertainty as percentile fan, not single line delusion.

## Scope

- Chart component in apps/web
- Lab page or analysis tab

## Grill me

- Show p10/p50/p90 bands, or more granular (p25/p75)?
- Overlay player's deterministic ledger path on fan chart?
- Color bands with semantic tokens from T055?
