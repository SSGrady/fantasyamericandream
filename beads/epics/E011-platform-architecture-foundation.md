---
id: E011
title: Platform Architecture Foundation
status: open
priority: P1
sprints:
  - S014
---

# E011 - Platform Architecture Foundation

## Goal

Establish durable architecture for the V1.5 game loop: package boundaries, workflow orchestration, client persistence, and branded financial types.

## Success Criteria

- [ ] ADR for package restructure (domain/, engine/, monte-carlo/, events/, learning/)
- [ ] XState workflow placement decided and documented
- [ ] Dexie persistence for run state, chapter progress, and replay metadata
- [ ] Branded types: MoneyCents, BasisPoints, TaxYear, etc. in shared package
- [ ] Migration path from current monorepo layout without breaking V0/V1 tests

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S014](../sprints/S014-platform-architecture/sprint.md) | Platform architecture foundation | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T074](../tickets/T074-adr-package-restructure.md) | ADR package restructure | open |
| [T075](../tickets/T075-xstate-workflow-placement.md) | XState workflow placement | open |
| [T076](../tickets/T076-dexie-persistence-layer.md) | Dexie persistence layer | open |
| [T077](../tickets/T077-branded-financial-types.md) | Branded financial types | open |

## Sequencing

Run **after S008** (command types inform domain boundaries) and **before or parallel with S009** (chapter machine needs workflow home).

## Related

- [ADR 002](../../docs/adr/002-tech-stack-monorepo.md)
- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
