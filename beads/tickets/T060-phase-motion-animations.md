---
id: T060
title: Phase motion animations
status: open
type: feature
priority: P3
epic: E008
sprint: S011
depends_on:
  - T048
acceptance:
  - Phase transitions use subtle motion (fade/slide) between chapter beats
  - prefers-reduced-motion disables nonessential animation
  - Processing/simulating phase shows progress indicator animation
  - No layout shift blocking interaction targets
---

# T060 - Phase Motion Animations

## Description

Add life to phase changes without casino UI noise.

## Scope

- Framer Motion or CSS transitions
- Play layout wrappers

## Grill me

- Framer Motion dependency acceptable, or CSS-only?
- Animate route transitions, or within-page state only?
- Duration budget: 200ms snappy vs 400ms cinematic?
