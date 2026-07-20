---
id: S015
title: Trust and Data Integrity
status: open
priority: P0
epic: E012
start_date: null
---

# S015 - Trust and Data Integrity (P0)

## Goal

Fix continuity-breaking trust gaps from V1.5 playthrough: chronology, identity propagation, attribution reconciliation, zero-preview, and cross-page consistency. Establish RunState foundation (E020 T086).

**Must ship first** before chapter shell work.

## Tickets

| ID | Title | Priority | Epic | Status |
|----|-------|----------|------|--------|
| [T079](../../tickets/T079-fix-chapter-chronology.md) | Fix chapter chronology | P0 | E012 | open |
| [T080](../../tickets/T080-accepted-offer-id-persistence.md) | acceptedOfferId persistence | P0 | E012 | open |
| [T081](../../tickets/T081-centralized-contribution-progress.md) | Centralized contribution progress | P0 | E012 | open |
| [T082](../../tickets/T082-attribution-invariant-test.md) | Attribution invariant test | P0 | E012 | open |
| [T083](../../tickets/T083-reconcile-financial-attribution.md) | Reconcile financial attribution | P0 | E012 | open |
| [T084](../../tickets/T084-zero-preview-validation-gate.md) | Zero-preview validation gate | P0 | E012 | open |
| [T085](../../tickets/T085-cross-page-value-consistency.md) | Cross-page value consistency | P0 | E012 | open |
| [T086](../../tickets/T086-runstate-authoritative-model.md) | RunState authoritative model | P1 | E020 | open |

## Progress

See [PROGRESS.md](./PROGRESS.md).

## Spec

- [ADR 014](../../../docs/adr/014-chapter-shell-and-chronology.md)
- [metrics-definitions.md](../../../docs/schema/metrics-definitions.md)

## Feedback Reference

Playthrough verdict: "financial documents workflow." P0 gaps: opening briefing Jan 1 vs chapter close Jul 31 mismatch; planning after simulate; counterfactual using inferred offer instead of `acceptedOfferId`; contribution progress recalculated per page; zero-effect preview.
