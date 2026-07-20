---
id: T096
title: Separate money from hours
status: done
type: bug
priority: P2
epic: E014
sprint: S017
depends_on:
  - T094
acceptance:
  - 401k deferral shows money cost and implicit time (payroll admin) separately from 0h/wk bug
  - Command metadata distinguishes monetary vs time budgets
  - UI never displays 0h/wk for payroll deferral unless truly zero admin time
  - Document time cost model in action command schema
---

# T096 - Separate Money from Hours

## Description

401k and similar money policies incorrectly showed 0h/wk. Split display: dollar impact vs optional weekly time cost for maintenance actions.

## Feedback

"401k is NOT 0h/wk" - conflating money and time undermines planning credibility.

## Grill me

- Assign default micro-hours to auto-payroll commands (0.5h/mo)?
- Hide time row for pure auto commands?
- Capacity cost only for active commands (job search, gig)?
