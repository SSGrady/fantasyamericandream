---
id: T027
title: Roth breakdown and CC autopay
status: done
type: fix
priority: P1
epic: E002
sprint: S005
depends_on: [T026]
acceptance:
  - Roth footnote splits starting, contributions, returns
  - startingRothBalance stored on play session
  - Credit card playbook spend posts then autopays in full
  - CC balance zero after monthly tick when starting at $0
  - Groceries and subscriptions on card, not double-counted from checking
---

# T027 - Roth Breakdown and CC Pay-in-Full

## Description

Fix Roth IRA contribution progress footnote math and model monthly credit card pay-in-full per Payday Playbook ($1,039/mo card spend including groceries).

## Completion

- `PlaySession.startingRothBalance` and `AuditSnapshot.accountInvestmentReturns`
- `ProgressRings` footnote: balance = starting + contributions + returns
- Living expenses charge groceries, subscriptions, discretionary to CC; autopay from checking
