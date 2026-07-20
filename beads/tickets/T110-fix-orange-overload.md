---
id: T110
title: Fix orange overload
status: open
type: bug
priority: P3
epic: E016
sprint: S019
depends_on:
  - T107
acceptance:
  - Selection state, primary CTA, and opportunity cards use distinct hues
  - Audit: no conflation of orange for both selected row and primary button
  - Design doc maps interaction roles to tokens
  - Playthrough screenshots issues resolved
---

# T110 - Fix Orange Overload

## Description

Playthrough feedback: orange used for selection, CTA, and opportunity interchangeably. Disambiguate with semantic tokens.

## Feedback

Orange overload made UI hierarchy unreadable.

## Grill me

- Primary CTA brand color vs semantic action token?
- Selected list item use border not fill?
- Opportunity always amber, never orange-500?
