---
id: T040
title: Command vocabulary v1 (~15 actions)
status: done
type: feature
priority: P1
epic: E005
sprint: S008
depends_on:
  - T037
  - T039
acceptance:
  - At least 15 command variants implemented with sim effects
  - Each command has schema, sim hook, and Decision Day copy stub
  - Commands cover finance, career, lifestyle minimum set from product feedback
  - Registry test asserts count >= 15
---

# T040 - Command Vocabulary v1 (~15 Actions)

## Description

Ship the first persistent action set: 401k deferral rate, Roth contribution, HYSA auto-transfer, job search intensity, delivery spend cap, subscription audit, relocation intent, side gig hours, etc.

## Scope

- Command registry in sim-engine
- Calibration defaults per command

## Grill me

- Which exact 15 commands ship in v1 vs defer to v2 (relocation, gig, grad school)?
- Job search as intensity slider (hrs/week) or discrete {low, medium, aggressive}?
- Include "coast mode" command that reduces career actions for health/family?
