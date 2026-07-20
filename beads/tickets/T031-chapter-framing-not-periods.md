---
id: T031
title: Chapter framing replaces period count
status: done
type: task
priority: P2
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Remove "Period 1 of 4" (or similar lifetime quarter framing) from play UI
  - Replace with calendar range (e.g. "Jan-Jun 2026") or chapter title
  - Briefing header uses chapter number or in-game month, not abstract period index
  - Copy audit for end-of-run totals still shows full timeline
---

# T031 - Chapter Framing Replaces Period Count

## Description

"Period 1 of 4" implies a fixed four-turn life and breaks immersion. Use chapter or calendar language aligned with ADR-010.

## Scope

- Play shell headers, briefing, audit breadcrumbs
- Session state labels

## Grill me

- Fixed chapter count per run, or open-ended until ending trigger?
- Show in-game month/year prominently, or chapter name only?
- Keep a debug period index in dev tools only?
