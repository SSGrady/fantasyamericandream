# S001 Progress - V0 Scaffold & Core Ledger

Last updated: 2026-07-19

## Ticket Status

- [x] **T001** - Repo scaffold (AGENTS.md, ADRs, beads, packages skeleton, vision/schema docs)
- [x] **T002** - Shared types + ledger invariants
- [x] **T003** - Monthly payroll & tax postings
- [ ] **T004** - Six-month audit tick
- [ ] **T005** - Layoff + macro + market stub

## Notes

### 2026-07-19

- Initial scaffold complete. ADRs 001–008 written and indexed.
- Feature set documented in `docs/vision/feature-set.md` including gaps: state taxes, life/dental/pet insurance, rent surges, DreamHome.
- Beads grill-me decisions captured in ADR-006 (markdown beads, no Jira for V0).
- Next: implement `packages/shared` types and first ledger invariant tests.

## Blockers

None.

## Velocity

3/5 tickets done (60%).

### 2026-07-19 (T003)

- `grossToNet` payroll stub with federal withholding and FICA.
- 401k deferral posts to traditional401k with IRS limit tracking.
- Monthly tick: rent, CC interest accrual, student loan payment (interest first).
- Golden fixture `monthly-tick-jan.json` and Vitest coverage.

### 2026-07-19 (T002)

- Ledger transaction types in `@fad/shared`.
- `applyTransactions`, `validateInvariants`, golden fixture, Vitest coverage for invariants 1-4.
