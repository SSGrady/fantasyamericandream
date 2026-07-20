---
id: T102
title: Directional consequence preview
status: done
type: feature
priority: P2
epic: E015
sprint: S018
depends_on:
  - T097
acceptance:
  - Pre-commit and mid-chapter previews show ranges or arrows, not point certainty
  - Copy distinguishes forecast from ledger fact
  - Preview uses same seed policy as impact API
  - No preview claims exact NW to the dollar for stochastic paths
---

# T102 - Directional Consequence Preview

## Description

Replace false-certainty impact numbers with directional previews (better/worse/neutral bands) where stochasticity applies.

## Feedback

Perfect certainty previews feel dishonest when market variability enabled.

## Grill me

- Three-tier labels (likely up / flat / likely down) vs numeric bands?
- Show bands only when sp_variability on?
- Align with Monte Carlo fan chart styling?
