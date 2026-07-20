---
id: T025
title: Rental picker before simulation
status: done
type: feature
priority: P1
epic: E002
sprint: S005
depends_on: [T017]
acceptance:
  - /create/rental route with 6-10 synthetic listings for player state
  - Housing arrangement split shown as player rent share
  - Selection stored on character draft and applied in build-game-state
  - Modules Continue routes to rental picker; Begin simulation clears session
---

# T025 - Rental Picker Before Simulation

## Description

Players choose a rental lease after module toggles and before the first briefing. Listings use state/metro calibration with roommate and partner splits from T017.

## Completion

2026-07-19: Added `/create/rental`, `RentalListingCard`, `rental-picker.ts`, and `V1RentalListingSelection` on character draft.
