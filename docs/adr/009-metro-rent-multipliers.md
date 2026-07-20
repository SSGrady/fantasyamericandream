# ADR 009: Metro Rent Multipliers (Stub)

**Status:** Accepted  
**Date:** 2026-07-20  
**Beads:** T019

## Context

V1 uses state-level COL tiers (T018) to sample market rent at character create. Top-GDP metros within a state can diverge sharply from the state midpoint (e.g. NYC vs upstate NY, SF vs inland CA). V2 needs metro-level rent anchors without a full metro picker UI yet.

## Decision

1. Document **top 25 GDP metros** with ZORI-style monthly rent anchors in `packages/data/src/calibration/housing/metros.ts`.
2. Store `metroId`, `zoriMonthlyUsd` (monthly USD, not thousands), and `rentMultiplierVsState` vs the state COL-tier midpoint.
3. Apply multiplier in `sampleMarketRentMonthly()` after the tier band draw: `effectiveRent = stateBaseline * metroMultiplier`.
4. Default metro per V0 state via `metroIdForState()` (existing mapping in `col-tiers.ts`).
5. Full metro picker UI deferred post-V2; state selection continues to imply the default metro.

## Consequences

- Same seed + state still yields deterministic rent, now metro-adjusted.
- Rental picker and `buildV0ScenarioFixture` inherit metro multipliers automatically.
- Non-V0 states in the anchor table are documented for future expansion but do not affect V0 play.

## Alternatives Considered

- Replace COL tiers entirely with metro ZORI values: rejected for V0 scope; tiers remain the fallback baseline.
- Stochastic metro multiplier each run: rejected; breaks deterministic replay.
