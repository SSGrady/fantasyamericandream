---
id: T011
title: Core play loop screens
status: done
type: feature
priority: P1
epic: E002
sprint: S003
depends_on: [T010]
acceptance:
  - Routes for briefing, decide, processing, analysis, reactions, audit, dashboard
  - Metrics ribbon on briefing header
  - Processing spinner and impact card placeholders
  - Wired navigation through one full loop stub
---

# T011 - Core Play Loop Screens

## Description

Implement consequence pipeline stages from ADR-007 as routed screens wired to sim-engine via `/api/sim/tick`, sessionStorage play state, and audit display components.

## Completion (2026-07-19)

- `/play/briefing` runs first six-month tick, metrics ribbon, narrative headline
- `/play/decide` pending decisions stub + open action textarea
- `/play/processing`, `/play/analysis`, `/play/reactions` minimal forward stubs
- `/play/audit` balance sheet, waterfall, contribution rings from AuditSnapshot
- `/play/dashboard` end stub after four periods
- `play-session.ts` persists GameState; loop clears audit between periods
