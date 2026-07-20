# S003 Progress - V1 UI Shell

Last updated: 2026-07-19

## Ticket Status

- [x] **T008** - UI shell + scenario select (Tailwind, landing, `/scenarios`, `/create` stub)
- [x] **T009** - Character creator
- [x] **T010** - Module toggles
- [ ] **T011** - Core play loop screens
- [ ] **T012** - V1 content and endings

## Notes

### 2026-07-19 (T010)

- Module toggles on `/create/modules`: economy, labor, life, hazards, housing, health, gig, tax, difficulty, hints.
- `@fad/shared` exports `V1RunConfig`, module IDs, and `enabledModulesFromV1RunConfig`.
- Session run config via `run-config.ts`; Begin simulation routes to `/play/briefing` stub.

### 2026-07-19 (T009)

- Character creator on `/create`: name, trait grids with modifier subtext, balance sheet form.
- `@fad/shared` exports `V1CharacterDraft`, trait option catalogs, scenario defaults.
- Session draft persisted via `character-draft.ts`; `/create/modules` stub for T010.

### 2026-07-19

- Tailwind CSS added to `apps/web` with light surface, white cards, serif headlines.
- Landing page links to scenario select (Fantasy President card-list pattern).
- `/scenarios` lists six starter scenarios from user-journey.md.
- `/create` stub page wired for selected scenario (client-side session storage).
- `@fad/shared` exports `V1StarterScenario` types and starter scenario catalog.

## Blockers

None.

## Velocity

3/5 tickets done (60%).
