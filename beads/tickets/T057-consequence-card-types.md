---
id: T057
title: Consequence card types
status: done
type: feature
priority: P1
epic: E008
sprint: S011
depends_on:
  - T055
  - T056
acceptance:
  - React card components: briefing, opportunity, hazard, learning, stakeholder, audit
  - Each type has layout, iconography, and semantic color role
  - Cards composable in chapter phases
  - Storybook or dev page showcases all types
---

# T057 - Consequence Card Types

## Description

Visual grammar for pipeline screens so each beat has distinct card identity.

## Scope

- `apps/web/src/components/consequence/`

## Grill me

- One card component with variant prop, or separate components per type?
- Hazard cards require dismiss action, or informational only?
- Learning cards embed quiz inline, or link to skill tree?
