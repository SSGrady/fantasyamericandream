# Briefing Metrics Definitions

Canonical formulas for audit ribbon metrics. UI labels and ledger computations must match this document.

Related: [housing-rent-system.md](../specifications/housing-rent-system.md) (T016-T017), ADR-003 monthly accounting.

---

## Net pay (monthly)

**Label:** Net pay / mo

**Formula:**

```
periodNetPay = sum(checking credits from W2 payroll transactions over audit period)
monthlyNetPay = periodNetPay / periodMonths
```

Where W2 payroll net pay is:

```
grossMonthly
  - federalWithholding
  - FICA (Social Security + Medicare)
  - employee401kDeferral
```

Dual-income households sum player and partner payroll net pays into the same period total.

Net pay is cash deposited to checking after pre-tax deferrals. It excludes discretionary transfers to savings accounts after payday.

---

## Savings rate

**Label:** Savings rate

**Formula:**

```
savingsInflows = sum(payroll 401k deferrals + transfer deposits to traditional401k, hsa, hysa, brokerage, rothIra)
savingsRate = savingsInflows / periodNetPay
```

Numerator counts intentional savings vehicle deposits during the audit period. Investment returns (`investment_return` transactions) are excluded even when they increase brokerage, Roth, or 401(k) balances.

Denominator is net pay (not gross, not residual cash after rent).

V0 has no HSA account yet; include `hsa` in the account list so future HSA payroll deferrals count automatically.

---

## Housing burden

**Label:** Housing burden

**Formula:**

```
monthlyRentShare = playerRentShare / periodMonths
housingBurden = monthlyRentShare / monthlyNetPay
```

`playerRentShare` is the player's portion of market rent for the audit period. T017 applies roommate and partner splits at character create; `location.rentPaymentMonthly` is the player's share and `location.marketRentMonthly` is the full listing rent.

---

## Debt-to-income (DTI)

**Label:** DTI

**Formula (V1.1):**

```
monthlyDebtService = creditCardMinimumPayments + studentLoanMinimumPayments
dti = monthlyDebtService / monthlyNetPay
```

V1.1 includes credit card and student loan minimums only. Auto loan and mortgage minimums join the numerator when those debt types exist (V2+).

Denominator is net pay, not gross salary.

---

## Emergency runway

**Label:** Runway

**Formula:**

```
monthlyBurn = (rent + childcare + federalWithholding + fica + creditCardInterest + studentLoanInterest + studentLoanPrincipal) / periodMonths
runwayMonths = checkingBalance / monthlyBurn
```

V0/V1 essential burn includes rent, payroll taxes, childcare, and debt service from ledger postings. Discretionary living expenses (food, transport, subscriptions) are not modeled yet, so runway can read high when checking accumulates unspent net pay.

---

## Waterfall labels

Payroll income splits into separate waterfall lines:

- **Net pay to checking** (and **Partner net pay to checking** when applicable)
- **401(k) deferrals** (and **Partner 401(k) deferrals** when applicable)

Market gains post as **Investment returns** under the `growth` category.

---

## Implementation map

| Metric | Source |
|--------|--------|
| Savings rate, period net pay | `packages/ledger/src/metrics.ts` via `buildAuditSnapshot` |
| Metric breakdown for analysis UI | `metricBreakdown` on `AuditSnapshot` from `buildAuditSnapshot` |
| Ribbon take-home, housing burden, DTI | `apps/web/src/lib/play-session.ts` `computeRibbonMetrics` |
| Audit snapshot fields | `packages/shared/src/types/game-state.ts` `AuditSnapshot` |
| Rent split | `packages/shared/src/types/housing-rent.ts`, `build-game-state.ts` |
