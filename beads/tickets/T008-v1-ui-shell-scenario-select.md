---
id: T008
title: UI shell + scenario select
status: done
type: feature
priority: P1
epic: E002
sprint: S003
depends_on: []
acceptance:
  - Tailwind CSS configured in apps/web
  - Landing page with tagline and navigation to scenarios
  - /scenarios page with six starter scenario cards
  - /create stub page reachable from scenario selection
  - pnpm typecheck, test, and @fad/web build pass
---

# T008 - UI Shell + Scenario Select

## Description

V1 foundation: design system, scenario picker matching Fantasy President card-list pattern, and routing stubs for the consequence pipeline.

## Completion (2026-07-19)

- Tailwind CSS + PostCSS in `apps/web`
- `PageShell`, `ScenarioCard`, `ScenarioCardList` components
- Routes: `/`, `/scenarios`, `/create`
- `packages/shared/src/types/v1-scenarios.ts` starter catalog
