---
id: T017
title: Housing arrangement + rent split
status: done
type: feature
priority: P1
epic: E002
sprint: S005
depends_on: [T016]
acceptance:
  - Character creator housing arrangement selector beyond state
  - Single options - 4 roommates, 1 roommate, solo (rent/4, rent/2, full)
  - Partnered/married options - split with partner or pay alone
  - Same split logic applied to utilities stub
  - Persisted in V1CharacterDraft and run config
  - Rent payment in sim reflects player share only
---

# T017 - Housing Arrangement + Rent Split

## Description

Flat state rent (e.g. $2500 LA) ignores roommate and partner splits. Character creator should capture housing arrangement so rent and utilities reflect the player's share.

## Scope

- `V1CharacterDraft` - `housingArrangement` field
- `/create` UI - arrangement selector by marital status
- `build-game-state.ts` - apply split to `location.rentPaymentMonthly`
- Utilities stub when expense module exists

## Notes

Grill-me resolutions in [housing-rent-system.md](../../docs/specifications/housing-rent-system.md). Phase V1.2.

## Completion

2026-07-19: Added `V1HousingArrangement`, `packages/shared/src/types/housing-rent.ts`, character creator TraitGrid, `build-game-state` rent split, `LocationState.marketRentMonthly` + player share on `rentPaymentMonthly`. Tests in `packages/shared/src/__tests__/housing-rent.test.ts`.
