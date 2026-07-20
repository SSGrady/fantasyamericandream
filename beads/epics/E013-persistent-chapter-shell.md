---
id: E013
title: Persistent Chapter Shell
status: done
priority: P1
sprints:
  - S016
---

# E013 - Persistent Chapter Shell (P1)

## Goal

Replace eight serial report pages with one persistent chapter route and panel-based stages. Players live through a chapter in place instead of navigating a financial documents workflow.

## Success Criteria

- [ ] Single route `/play/:runId/chapter/:chapterNumber` (or equivalent) hosts full chapter
- [ ] Panel stages: Briefing → Plan → Live → Close (not separate full-page routes)
- [ ] Sticky life rail: job, runway, capacity, goals, open threads
- [ ] Chapter Close merges Impact + Reactions + Counterfactual + Audit into tabbed view: Story | Money | What If? | Voices | Lesson
- [ ] Serial report-page navigation removed from happy path

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S016](../sprints/S016-chapter-shell/sprint.md) | Chapter shell + Chapter Close merge | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T090](../tickets/T090-persistent-chapter-shell-route.md) | Persistent chapter shell route | open |
| [T091](../tickets/T091-sticky-life-rail.md) | Sticky life rail | open |
| [T092](../tickets/T092-chapter-close-tabbed-merge.md) | Chapter Close tabbed merge | open |
| [T093](../tickets/T093-panel-based-stage-navigation.md) | Panel-based stage navigation | open |

## Depends On

- [S015](../sprints/S015-trust-data-integrity/sprint.md) - chronology and value consistency must land first
- [E020](./E020-run-state-selector-layer.md) - XState chapter flow update

## Related

- [E006](./E006-chapter-vertical-slice.md) - V1.5 vertical slice this replaces in UX
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
