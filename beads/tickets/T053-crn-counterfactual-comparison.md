---
id: T053
title: CRN counterfactual comparison
status: done
type: feature
priority: P2
epic: E007
sprint: S010
depends_on:
  - T049
  - T046
acceptance:
  - Common random numbers align macro draws across two command scenarios
  - Lab UI compares path A vs path B fan charts overlaid or side by side
  - Delta emphasizes decision effect holding luck fixed
  - Document CRN limitations in metrics doc
---

# T053 - CRN Counterfactual Comparison

## Description

Hold macro luck fixed to isolate effect of command changes in Monte Carlo lab.

## Scope

- monte-carlo CRN mode
- Lab comparison UI

## Grill me

- CRN at regime level only, or per-month return draws too?
- Expose CRN toggle to players, or always on for comparisons?
- Sync with chapter counterfactual screen (T046) or separate lab-only feature?
