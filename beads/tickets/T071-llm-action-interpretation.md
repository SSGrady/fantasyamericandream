---
id: T071
title: LLM action interpretation
status: open
type: feature
priority: P2
epic: E010
sprint: S013
depends_on:
  - T040
  - T069
  - T070
acceptance:
  - Optional natural-language input parsed to suggested ActionCommands
  - Suggestions shown for player confirm; never auto-applied
  - Zod validates LLM command suggestions against ActionCommand union
  - Invalid suggestions show template help text
---

# T071 - LLM Action Interpretation

## Description

"Put an extra $200 toward Roth and cut delivery" → suggested commands for confirm.

## Scope

- Decide screen NL input (optional)
- LLM prompt + schema

## Grill me

- NL input primary UX, or power-user Easter egg only?
- Clarifying question loop from LLM, or single-shot parse?
- Block NL when offline/no model downloaded?
