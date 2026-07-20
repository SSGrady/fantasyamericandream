---
id: T092
title: Chapter Close tabbed merge
status: done
type: feature
priority: P1
epic: E013
sprint: S016
depends_on:
  - T090
  - T085
acceptance:
  - Chapter Close stage has tabs: Story | Money | What If? | Voices | Lesson
  - Story: editorial headlines + month timeline (from analysis/reactions)
  - Money: audit waterfall (from audit page)
  - What If?: counterfactual comparison
  - Voices: stakeholder reactions
  - Lesson: chapter literacy unlock
  - Tab switch does not remount life rail or re-fetch metrics
---

# T092 - Chapter Close Tabbed Merge

## Description

Merge Impact, Reactions, Counterfactual, and Audit into one Chapter Close surface with tabs. Removes serial report navigation from happy path.

## Scope

- Refactor existing play page components into tab panels
- Deprecate standalone routes or redirect into shell

## Feedback

"Financial documents workflow" - four separate close reports feel like filing, not closure.

## Grill me

- Default tab Story or Money?
- Allow tab order customization by literacy unlock?
- Keep standalone URLs as hash deep links (#what-if)?
