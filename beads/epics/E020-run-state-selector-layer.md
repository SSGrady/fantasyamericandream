---
id: E020
title: RunState and Selector Layer
status: in_progress
priority: P1
sprints:
  - S015
  - S016
---

# E020 - RunState and Selector Layer

## Goal

Extend E011 platform architecture with an authoritative RunState model, memoized selector layer, DecisionRecord event sourcing, and updated XState chapter flow for the continuity pass.

## Success Criteria

- [ ] RunState is single authoritative client model (replaces ad hoc session fields)
- [ ] Selector layer: `selectNetWorth`, `selectLiquidRunway`, `selectContributionProgress`, etc.
- [ ] DecisionRecord append-only log for player choices and command commits
- [ ] XState chapter flow: `openingBriefing → planning → simulating → interrupt → chapterClose`
- [ ] Selectors power all play surfaces; no per-page financial recalculation

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S015](../sprints/S015-trust-data-integrity/sprint.md) | RunState foundation | Open |
| [S016](../sprints/S016-chapter-shell/sprint.md) | Selectors + XState update | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T086](../tickets/T086-runstate-authoritative-model.md) | RunState authoritative model | open |
| [T087](../tickets/T087-selector-layer.md) | Selector layer | open |
| [T088](../tickets/T088-decision-record-event-sourcing.md) | DecisionRecord event sourcing | open |
| [T089](../tickets/T089-xstate-chapter-flow-update.md) | XState chapter flow update | open |

## Sequencing

Run **in parallel with S015 trust fixes** (T086 first). T087-T089 land in S016 before chapter shell routes consume them.

## Related

- [E011](./E011-platform-architecture-foundation.md) - V1.5 architecture foundation
- [ADR 012](../../docs/adr/012-package-restructure.md)
- [ADR 013](../../docs/adr/013-chapter-workflow.md) - superseded in spirit by ADR-014 phase model
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
