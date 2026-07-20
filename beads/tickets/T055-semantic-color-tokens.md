---
id: T055
title: Semantic color CSS tokens
status: open
type: feature
priority: P1
epic: E008
sprint: S011
depends_on: []
acceptance:
  - CSS custom properties for semantic roles: growth, hazard, opportunity, neutral, warning, learning
  - Tailwind config maps to tokens; no hardcoded hex in play components (lint or review)
  - Dark mode tokens defined if app supports dark mode
  - Token spec documented in docs/design/
---

# T055 - Semantic Color CSS Tokens

## Description

Replace ad hoc colors with consequence-meaning tokens (green growth, amber hazard, etc.).

## Scope

- `apps/web/src/app/globals.css` or tokens file
- Tailwind theme extension

## Grill me

- Exact hex values from user spec sheet, or derive from accessible palette generator?
- Red for negative wealth only, or also for relationship hazard?
- High contrast mode overrides required for WCAG AAA?
