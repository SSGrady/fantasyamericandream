---
id: T018
title: COL-tier stochastic rent ranges
status: done
type: feature
priority: P2
epic: E002
sprint: S005
depends_on: [T017]
acceptance:
  - States/metros classified VHCOL, HCOL, MCOL, LCOL
  - Rent sampled from tier range per seed, not flat state constant
  - Sector salary variability documented or enhanced via v0-rent-only
  - Calibration data in packages/data/src/calibration/housing/
  - Same seed + draft produces same rent at character create
---

# T018 - COL-Tier Stochastic Rent Ranges

## Description

Replace flat `STATE_METRO_RENT` constants with COL-tier bands. Rent is drawn once at character creation from tier-specific ranges (seeded), replacing the current fixed $2500 LA pattern.

## Scope

- `packages/data/src/calibration/housing/` - tier tables, state-to-tier map
- `buildV0ScenarioFixture` or successor - sample rent from tier
- Document interaction with sector salary bands in v0-rent-only

## Notes

Phase V1.2 in [housing-rent-system.md](../../docs/specifications/housing-rent-system.md).
