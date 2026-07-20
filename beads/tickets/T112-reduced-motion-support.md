---
id: T112
title: Reduced-motion support
status: open
type: task
priority: P3
epic: E016
sprint: S019
depends_on:
  - T109
acceptance:
  - prefers-reduced-motion disables month rail animation, panel slides, balance count-up
  - Instant state transitions remain functional
  - Document in accessibility section of design doc
  - Manual test checklist in ticket notes on completion
---

# T112 - Reduced-Motion Support

## Description

Ensure all V1.6 motion honors prefers-reduced-motion (extends T060).

## Grill me

- System setting only, or in-game toggle too?
- Replace animation with crossfade, or hard cut?
- Test in Safari iOS reduced motion?
