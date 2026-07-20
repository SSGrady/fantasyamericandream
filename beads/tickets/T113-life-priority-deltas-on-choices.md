---
id: T113
title: Life priority deltas on choices
status: done
type: feature
priority: P3
epic: E017
sprint: S020
depends_on:
  - T064
acceptance:
  - Each plan and interrupt choice shows delta badges for player's top 3 priorities
  - Deltas derived from authored choice metadata, not LLM
  - Priorities read from RunState set at onboarding
  - Example: "Wealth +2, Time -1" on RTO accept
---

# T113 - Life Priority Deltas on Choices

## Description

Show how each choice affects player-stated life priorities on decision cards.

## Feedback

Choices showed dollars but not life stakes aligned to stated priorities.

## Grill me

- Numeric deltas (-2 to +2) vs verbal (helps/hurts)?
- Weight top priority double in display?
- Hide deltas when priorities not set (legacy runs)?
