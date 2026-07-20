---
id: T014
title: Skill tree v1 UI
status: done
type: feature
priority: P1
epic: E002
sprint: S004
depends_on: [T011]
acceptance:
  - Dashboard shows all 10 literacy skills with locked/unlocked state
  - First $100K quiz unlocks investing_i and savings-rate emphasis in analysis
  - Quizzes unlock analysis tools only, not market luck
---

# T014 - Skill Tree v1 UI

## Description

Replace the dashboard skill tree stub with full literacy tracks from `LITERACY_SKILL_STUBS`. Wire the decision-day quiz to persist unlocks and reflect them on analysis cards.

## Completion (2026-07-19)

- `literacyProgress` persisted on play session from `createDefaultLiteracyProgress`.
- Dashboard renders all 10 skills with unlock descriptions.
- Correct First $100K quiz answer unlocks `investing_i`; analysis card copy emphasizes savings rate.
