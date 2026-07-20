---
id: E006
title: Chapter Vertical Slice
status: done
priority: P1
sprints:
  - S009
---

# E006 - Chapter Vertical Slice (P2)

## Goal

Ship one excellent authored chapter (CA software engineer) that proves the full consequence pipeline end to end: briefing through counterfactual, with interrupts and a relevant lesson unlock.

## Success Criteria

- [ ] CA software engineer chapter content authored and seeded
- [ ] Three job offers, housing choice, six-month plan beat
- [ ] Interrupts: return-to-office, market surprise, mid-cycle job offer
- [ ] Counterfactual comparison screen (what-if path)
- [ ] Relevant literacy lesson unlock tied to chapter outcome
- [ ] XState chapter workflow: briefing → planning → simulating → consequence → counterfactual → audit → dashboard

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S009](../sprints/S009-chapter-vertical-slice/sprint.md) | CA engineer chapter slice | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T042](../tickets/T042-adr-chapter-workflow-xstate.md) | ADR chapter workflow + XState | open |
| [T043](../tickets/T043-ca-engineer-chapter-content.md) | CA engineer chapter content | open |
| [T044](../tickets/T044-chapter-job-offers-housing.md) | Job offers and housing choice | open |
| [T045](../tickets/T045-chapter-interrupt-events.md) | Chapter interrupt events | open |
| [T046](../tickets/T046-counterfactual-comparison.md) | Counterfactual comparison screen | open |
| [T047](../tickets/T047-chapter-lesson-unlock.md) | Chapter lesson unlock | open |
| [T048](../tickets/T048-xstate-chapter-machine.md) | XState chapter machine | open |

## Depends On

- [E005](./E005-action-command-system.md) - chapters consume command vocabulary
- [E011](./E011-platform-architecture-foundation.md) - XState and workflow placement

## Related

- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
