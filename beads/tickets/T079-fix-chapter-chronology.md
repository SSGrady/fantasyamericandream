---
id: T079
title: Fix chapter chronology
status: open
type: bug
priority: P0
epic: E012
sprint: S015
depends_on: []
acceptance:
  - Opening briefing anchors Jan 1; chapter close anchors Jul 31 for six-month window
  - UI never offers planning for a period already simulated or closed
  - ChapterPeriod blocks plan stage when status is closed or in_progress past commit
  - Golden test: chronology labels consistent across briefing, plan, and close
---

# T079 - Fix Chapter Chronology

## Description

Playthrough showed opening briefing dated Jan 1 while chapter close referenced Jul 31 inconsistently, and planning remained available after simulation. Align calendar anchors and gate plan stage by period lifecycle.

## Scope

- Chapter date helpers in shared types
- Briefing and audit date copy
- Plan route guard when period closed

## Feedback

"Never plan a closed period." Opening vs close date mismatch breaks chapter continuity.

## Grill me

- Use fiscal half-year labels (H1 2026) or explicit month range (Jan-Jul 2026)?
- When player reloads mid-chapter, derive period from RunState or URL chapter number?
- Block back navigation to Plan after commit, or allow read-only plan review?
