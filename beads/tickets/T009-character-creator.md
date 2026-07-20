---
id: T009
title: Character creator
status: done
type: feature
priority: P1
epic: E002
sprint: S003
depends_on: [T008]
acceptance:
  - /create page with trait grid and balance sheet form
  - Sections from user-journey.md (name, age, state, education, career, habits)
  - Client-side draft state persisted to session
  - Navigation to module toggles on continue
---

# T009 - Character Creator

## Description

Character setup screen with card grids and modifier subtext per user-journey.md section 2.

## Completion (2026-07-19)

- `/create` trait grids (age, state, education, career, marital, habits) and balance sheet form.
- `@fad/shared` `V1CharacterDraft` types, trait options, scenario defaults.
- Session draft persistence via `character-draft.ts`; scenario carry-over from T008.
- Continue navigates to `/create/modules` stub for T010.
