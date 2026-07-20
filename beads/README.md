# Beads - Project Tracking

File-based project management for Fantasy American Dream. Adapted from [Cineborough ADR-007](https://github.com) / AutoCode bead data model.

## Hierarchy

```
Epic (multi-sprint initiative)
 └── Sprint (time-boxed work unit)
      └── Ticket (atomic task)
```

## Status Legend

| Status | Meaning |
|--------|---------|
| `open` | Defined, not started |
| `in_progress` | Actively being worked |
| `done` | Complete, acceptance criteria met |
| `closed` | Done and verified; no further work expected |

## ID Conventions

| Level | Format | Example |
|-------|--------|---------|
| Epic | `E001` | `E001-v0-financial-engine` |
| Sprint | `S001` | `S001-v0-scaffold` |
| Ticket | `T001` | `T001-repo-scaffold` |

## Ticket Template

```markdown
---
id: T00X
title: Short descriptive title
status: open
type: feature | task | bug | chore | spike
priority: P1 | P2 | P3
epic: E001
sprint: S001
depends_on: []
acceptance:
  - Criterion one
  - Criterion two
---

## Description

What and why.

## Notes

Progress comments go here.
```

## Progress Update Protocol

When completing a ticket:

1. Set `status: done` in ticket frontmatter
2. Add completion note in ticket body
3. Update `beads/sprints/S00X/PROGRESS.md` checkbox
4. Append dated entry to `beads/CHANGELOG.md`
5. Promote durable decisions to `docs/adr/` or `docs/schema/`

## Current Active Work

- **Epic (V1.5 game loop):** [E004 - Trust and Metric Integrity](./epics/E004-trust-metric-integrity.md) (P0)
- **Sprint (P0 trust):** [S007 - Trust and Metric Fixes](./sprints/S007-trust-metric-fixes/sprint.md) (T028-T035)
- **Epic (V1.5 commands):** [E005 - Action Command System](./epics/E005-action-command-system.md) / [S008](./sprints/S008-action-commands-foundation/sprint.md)
- **Epic (V1.5 chapter):** [E006 - Chapter Vertical Slice](./epics/E006-chapter-vertical-slice.md) / [S009](./sprints/S009-chapter-vertical-slice/sprint.md)
- **Epic (architecture):** [E011 - Platform Architecture Foundation](./epics/E011-platform-architecture-foundation.md) / [S014](./sprints/S014-platform-architecture/sprint.md)
- **Epic (household, parallel):** [E003 - V2 Household Simulator](./epics/E003-v2-household-simulator.md) / [S006](./sprints/S006-v2-household-foundation/sprint.md)

Full V1.5 sequencing: E004 → E005/E011 → E006 → E007/E008/E009 → E010. See [ADR-010](../docs/adr/010-game-loop-and-consequence-pipeline.md) and [PLAN.md](../PLAN.md) V1.5.

**V1.6 Continuity Pass:** E012 (trust) → E020/E013 (shell) → E014-E019. See [ADR-014](../docs/adr/014-chapter-shell-and-chronology.md) and [PLAN.md](../PLAN.md) V1.6. Active sprint: [S015](./sprints/S015-trust-data-integrity/sprint.md).
