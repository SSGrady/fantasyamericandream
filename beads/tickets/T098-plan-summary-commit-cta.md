---
id: T098
title: Plan summary commit CTA
status: done
type: feature
priority: P2
epic: E014
sprint: S017
depends_on:
  - T097
  - T088
acceptance:
  - Plan summary lists all committed money and time policies before sim
  - Primary CTA "Commit this plan" writes DecisionRecord and transitions to Live
  - Secondary "Reset to last commit" available
  - Cannot enter Live without explicit commit
---

# T098 - Plan Summary Commit CTA

## Description

Explicit plan summary and commit action before live simulation begins. Separates planning from simulating in player mental model.

## Feedback

Player could drift into simulation without acknowledging plan choices.

## Grill me

- Require typing confirm for first chapter?
- Show diff vs previous chapter plan?
- Allow commit with validation warnings (non-blocking)?
