# S002 Progress - V0 Scenarios & Event Schema

Last updated: 2026-07-19

## Ticket Status

- [x] **T006** - Scenario matrix end-to-end (5 careers × 8 states)
- [x] **T007** - Event definitions + literacy skill stubs

## Notes

### 2026-07-19

- `packages/data/src/scenarios/v0-rent-only.ts` - 40 rent-only scenario configs with career/state salary and rent calibration.
- `tickSixMonthsWithSimulation` wraps 6-month sim tick + audit snapshot.
- Vitest matrix test runs all 40 scenarios with invariant and waterfall checks.
- `packages/sim-engine/src/events/definitions/v0-starter-events.ts` - 20 V0 starter event definitions.
- `packages/shared/src/types/literacy-skills.ts` - 10 literacy skill stubs from feature-set skill tree.
- E001 epic marked done; all success criteria met.

## Blockers

None.

## Velocity

2/2 tickets done (100%).
