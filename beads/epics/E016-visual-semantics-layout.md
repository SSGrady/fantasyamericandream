---
id: E016
title: Visual Semantics and Layout
status: done
priority: P4
sprints:
  - S019
---

# E016 - Visual Semantics and Layout (P4)

## Goal

Evolve V1.5 consequence theater into a chapter-native layout system. Wider shell, semantic tokens, distinct card grammar, and motion continuity so the UI reads as living through a chapter, not filing reports.

## Success Criteria

- [ ] Wider shell (1180-1240px), 12-column grid, sticky rail
- [ ] Semantic color tokens: action, wealth, opportunity, risk, learning, life, world
- [ ] Distinct card types: briefing, decision, opportunity, hazard, etc.
- [ ] Motion continuity: selection, month advance, balance count-up; reduced-motion respected
- [ ] Orange overload fixed: selection vs CTA vs opportunity visually distinct

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S019](../sprints/S019-visual-semantics-layout/sprint.md) | Visual semantics + layout | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T106](../tickets/T106-wider-shell-12-col-grid.md) | Wider shell 12-col grid | open |
| [T107](../tickets/T107-semantic-color-tokens-v16.md) | Semantic color tokens v1.6 | open |
| [T108](../tickets/T108-distinct-card-types-v16.md) | Distinct card types v1.6 | open |
| [T109](../tickets/T109-motion-continuity.md) | Motion continuity | open |
| [T110](../tickets/T110-fix-orange-overload.md) | Fix orange overload | open |
| [T111](../tickets/T111-sticky-rail-layout.md) | Sticky rail layout | open |
| [T112](../tickets/T112-reduced-motion-support.md) | Reduced-motion support | open |

## Depends On

- [E013](./E013-persistent-chapter-shell.md) - layout wraps chapter shell

## Related

- [E008](./E008-consequence-theater-visual-design.md) - V1.5 theater foundation; E016 extends for chapter-native UX
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
