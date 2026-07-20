# Briefing Metrics Definitions

Canonical formulas for audit ribbon metrics. UI labels and ledger computations must match this document.

Related: [housing-rent-system.md](../specifications/housing-rent-system.md) (T016), ADR-003 monthly accounting.

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
savingsInflows = sum(net inflows to traditional401k, hsa, hysa, brokerage, rothIra)
savingsRate = savingsInflows / periodNetPay
```

Numerator counts intentional savings vehicle deposits during the audit period. Denominator is net pay (not gross, not residual cash after rent).

V0 has no HSA account yet; include `hsa` in the account list so future HSA payroll deferrals count automatically.

---

## Housing burden

**Label:** Housing burden

**Formula:**

```
monthlyRentShare = playerRentShare / periodMonths
housingBurden = monthlyRentShare / monthlyNetPay
```

`playerRentShare` is the player's portion of market rent for the audit period. V1.1 uses full `location.rentPaymentMonthly` until T017 rent-split UI ships.

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

Unchanged from ledger audit: checking balance divided by estimated monthly burn (rent, payroll taxes, debt service) over the audit period.

---

## Implementation map

| Metric | Source |
|--------|--------|
| Savings rate, period net pay | `packages/ledger/src/metrics.ts` via `buildAuditSnapshot` |
| Ribbon take-home, housing burden, DTI | `apps/web/src/lib/play-session.ts` `computeRibbonMetrics` |
| Audit snapshot fields | `packages/shared/src/types/game-state.ts` `AuditSnapshot` |
