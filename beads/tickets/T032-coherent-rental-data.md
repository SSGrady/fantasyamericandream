---
id: T032
title: Coherent rental data pipeline
status: open
type: bug
priority: P1
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Rental picker listings derive from same COL-tier/metro calibration as monthly tick rent
  - Player-selected listing rent matches tick posting within documented jitter tolerance
  - Listing metadata (beds, neighborhood tier) consistent with rent band
  - Regression test: picker selection → six-month tick → audit rent line
---

# T032 - Coherent Rental Data Pipeline

## Description

Rental picker synthetic listings can disagree with tick rent and metro multipliers. Unify data path from calibration through picker to ledger.

## Scope

- `packages/data/src/calibration/housing/`
- `apps/web/src/app/create/rental/`
- `packages/sim-engine/` rent posting

## Grill me

- Regenerate listings on metro change, or lock at pick time for replay determinism?
- Show gross rent vs player share on listing cards?
- Cap listing count at 6, 10, or dynamic by metro?
