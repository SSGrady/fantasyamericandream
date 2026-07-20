---
id: T052
title: Goal probability engine
status: done
type: feature
priority: P2
epic: E007
sprint: S010
depends_on:
  - T049
acceptance:
  - computeGoalProbability(goal, paths) for Coast FIRE, emergency fund months, down payment
  - Goals defined in shared types with target thresholds
  - Results shown as percentage with plain-language copy
  - Unit tests with fixed seed and known probability band
---

# T052 - Goal Probability Engine

## Description

Answer "what are my odds of hitting Coast FIRE by 40?" from forecast paths.

## Scope

- monte-carlo package
- Lab UI goal cards

## Grill me

- Which three goals ship in v1 lab vs full goal library?
- Coast FIRE definition: lean vs regular vs fat threshold from calibration?
- Show probability conditional on current commands, or passive baseline only?
