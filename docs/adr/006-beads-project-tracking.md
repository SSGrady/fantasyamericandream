# ADR 006: Beads Project Tracking System

## Status

Accepted

## Date

2026-07-19

## Context

Fantasy American Dream is a personal project developed with AI agent assistance. It needs lightweight project tracking without Jira overhead, while preserving epic/sprint/ticket hierarchy for multi-month simulation work.

Cineborough's beads pattern (ADR-007) and AutoCode's bead data model proved effective: markdown files in git, agent-readable, no external tooling.

## Decision

Implement file-based project tracking in `beads/`:

```
beads/
├── README.md
├── CHANGELOG.md
├── epics/
├── sprints/
│   └── S001-*/
│       ├── sprint.md
│       └── PROGRESS.md
└── tickets/
```

### Ticket frontmatter

```yaml
---
id: T001
title: Short title
status: open | in_progress | done | closed
type: feature | task | bug | chore | spike
priority: P1 | P2 | P3
epic: E001
sprint: S001
depends_on: []
acceptance:
  - Criterion one
---
```

### Progress update protocol

When completing work, update **all three**:

1. Ticket frontmatter (`status: done`) + completion note in body
2. Sprint `PROGRESS.md` checkboxes and dated notes
3. `beads/CHANGELOG.md` dated entry

Durable outcomes from tickets → promote to `docs/adr/` or `docs/schema/`.

### ID conventions

- Epics: `E001`, `E002`, …
- Sprints: `S001`, `S002`, …
- Tickets: `T001`, `T002`, …

### Grill-me resolutions (2026-07-19)

| Question | Decision |
|----------|----------|
| Beads vs GitHub Issues? | **Beads** - repo-local, agent-first, no board sync drift |
| Beads vs Jira? | **Beads** - personal project; Jira overhead not justified |
| Beads vs `.beads/issues.jsonl` (template-engine)? | **Markdown beads** - richer acceptance criteria, human-readable diffs |
| Sync beads to Jira later? | Optional export script in V3; not V0 scope |
| Who updates PROGRESS.md? | **Agent completing ticket** - mandatory in AGENTS.md workflow |
| Epic per phase or per domain? | **Per major initiative** (E001=V0 engine, E002=V1 UI, …) |

## Consequences

- Agents create tickets before non-trivial feature work.
- Closed tickets are frozen history - do not edit acceptance after close.
- `beads/README.md` links current active epic/sprint.

## Alternatives Considered

- **GitHub Issues** - rejected; wants repo-local tracking readable by agents offline.
- **Flat ticket list** - rejected; epic/sprint hierarchy needed for V0→V3 phasing.
- **Jira + beads duplicate** - rejected; single source of truth in repo.
