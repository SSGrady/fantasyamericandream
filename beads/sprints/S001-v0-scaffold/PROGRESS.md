# S001 Progress - V0 Scaffold & Core Ledger

Last updated: 2026-07-19

## Ticket Status

- [x] **T001** - Repo scaffold (AGENTS.md, ADRs, beads, packages skeleton, vision/schema docs)
- [x] **T002** - Shared types + ledger invariants
- [x] **T003** - Monthly payroll & tax postings
- [x] **T004** - Six-month audit tick
- [x] **T005** - Layoff + macro + market stub

## Notes

### 2026-07-19

- Initial scaffold complete. ADRs 001–008 written and indexed.
- Feature set documented in `docs/vision/feature-set.md` including gaps: state taxes, life/dental/pet insurance, rent surges, DreamHome.
- Beads grill-me decisions captured in ADR-006 (markdown beads, no Jira for V0).
- Next: implement `packages/shared` types and first ledger invariant tests.

## Blockers

None.

## Velocity

5/5 tickets done (100%).

### 2026-07-19 (T005)

- Seeded PRNG with Box-Muller normal samples in `packages/sim-engine/src/rng.ts`.
- `MacroRegime` multipliers in `macro-regimes.ts` (expansion 0.8x, severe recession 2.5x layoff climate).
- Monthly layoff hazard from BLS baseline (1.1%) modifies `CareerState` (unemployment, optional salary reset).
- Regime-conditioned portfolio returns post via ledger `investment_return` transactions.
- `tickMonthsWithSimulation` golden determinism test over 12 months (`twelve-month-determinism.json`).

### 2026-07-19 (T004)

- `tickSixMonths` orchestrates 6 monthly ledger ticks from a start date.
- `AuditSnapshot` with net worth, delta, waterfall, savings rate, emergency runway.
- Contribution progress for 401k and Roth IRA against IRS limits.
- `exportAuditJson` and golden fixture `six-month-audit-jan-jun.json`.

### 2026-07-19 (T003)

- `grossToNet` payroll stub with federal withholding and FICA.
- 401k deferral posts to traditional401k with IRS limit tracking.
- Monthly tick: rent, CC interest accrual, student loan payment (interest first).
- Golden fixture `monthly-tick-jan.json` and Vitest coverage.

### 2026-07-19 (T002)

- Ledger transaction types in `@fad/shared`.
- `applyTransactions`, `validateInvariants`, golden fixture, Vitest coverage for invariants 1-4.
