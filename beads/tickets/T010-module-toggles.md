---
id: T010
title: Module toggles
status: done
type: feature
priority: P1
epic: E002
sprint: S003
depends_on: [T009]
acceptance:
  - /create/modules page with grouped toggle panels
  - Economy, labor, life, hazards, housing, health, gig, tax, difficulty, hints groups
  - Begin simulation action navigates to first briefing stub
---

# T010 - Module Toggles

## Description

Fantasy President settings pattern for simulation module toggles per user-journey.md section 3.

## Completion (2026-07-19)

- `/create/modules` grouped toggle panels for all ten module categories.
- `@fad/shared` `V1RunConfig`, `V1ModuleToggles`, and `enabledModulesFromV1RunConfig`.
- Session persistence via `run-config.ts`; redirect to `/create` if character draft missing.
- Begin simulation navigates to `/play/briefing` stub with run config saved.
