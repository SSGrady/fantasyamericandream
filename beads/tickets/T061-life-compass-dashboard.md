---
id: T061
title: Life Compass dashboard
status: open
type: feature
priority: P2
epic: E008
sprint: S011
depends_on: []
acceptance:
  - Five dimensions: wealth, career, health, relationships, time
  - Each dimension scored 0-100 from structured state (not LLM)
  - Compass visual on dashboard/audit; drill-down copy per dimension
  - Dimension deltas shown vs prior chapter
---

# T061 - Life Compass Dashboard

## Description

Holistic progress view beyond net worth so players see tradeoffs across life domains.

## Scope

- Compass component
- Scoring functions in shared or sim-engine

## Grill me

- Equal weight five dimensions in "overall score", or hide aggregate?
- Health dimension stub until V2 medical events, or proxy from stress commands?
- Show compass during briefing, or dashboard only?
