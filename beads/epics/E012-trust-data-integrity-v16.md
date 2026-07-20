---
id: E012
title: Trust and Data Integrity (V1.6)
status: done
priority: P0
sprints:
  - S015
---

# E012 - Trust and Data Integrity (P0)

## Goal

Close continuity-breaking trust gaps surfaced in V1.5 playthrough review. Players must see one coherent financial story from opening briefing through chapter close, with no inferred identity, no planning after simulation, and no divergent numbers across pages.

## Success Criteria

- [ ] `acceptedOfferId` immutable after acceptance; counterfactual uses stored choice, not UI inference
- [ ] Chapter chronology consistent: opening briefing Jan 1, chapter close Jul 31; never plan a closed period
- [ ] Ending net worth reconciles: choice + market + lifestyle + events = delta
- [ ] Single contribution progress selector; no per-page recalculation drift
- [ ] Zero-effect consequence preview blocked or explained via command validation gate
- [ ] Impact, reactions, audit, and dashboard show identical canonical values
- [ ] Invariant tests for attribution equation and contribution progress

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S015](../sprints/S015-trust-data-integrity/sprint.md) | P0 trust and data integrity | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T079](../tickets/T079-fix-chapter-chronology.md) | Fix chapter chronology | open |
| [T080](../tickets/T080-accepted-offer-id-persistence.md) | acceptedOfferId persistence | open |
| [T081](../tickets/T081-centralized-contribution-progress.md) | Centralized contribution progress | open |
| [T082](../tickets/T082-attribution-invariant-test.md) | Attribution invariant test | open |
| [T083](../tickets/T083-reconcile-financial-attribution.md) | Reconcile financial attribution | open |
| [T084](../tickets/T084-zero-preview-validation-gate.md) | Zero-preview validation gate | open |
| [T085](../tickets/T085-cross-page-value-consistency.md) | Cross-page value consistency | open |

## Related

- [E004](./E004-trust-metric-integrity.md) - V1.5 trust pass (complete); E012 is the continuity follow-up
- [E020](./E020-run-state-selector-layer.md) - authoritative RunState and selectors underpin trust fixes
- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
