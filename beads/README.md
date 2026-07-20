# Beads - Project Tracking

File-based project management for Life Ledger. Adapted from [Cineborough ADR-007](https://github.com) / AutoCode bead data model.

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

- **Epic:** [E001 - V0 Financial Engine Prototype](./epics/E001-v0-financial-engine.md)
- **Sprint:** [S001 - V0 Scaffold & Core Ledger](./sprints/S001-v0-scaffold/sprint.md)
