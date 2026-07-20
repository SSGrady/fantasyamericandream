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

## Savings rate metrics

Three distinct ribbon metrics replace the single blended savings rate. HYSA, brokerage, Roth, and HSA transfers count as savings (cash surplus), not as residual checking balance.

### 401(k) deferral rate

**Label:** 401(k) deferral

**Formula:**

```
deferral401kRate = payroll401kDeferrals / periodNetPay
```

Numerator is employee 401(k) deferrals posted from W2 payroll during the audit period. Denominator is net pay deposited to checking.

### Cash surplus rate

**Label:** Cash surplus

**Formula:**

```
cashSurplusRate = transferSavingsInflows / periodNetPay
```

Numerator is post-payday transfers to HYSA, brokerage, Roth IRA, or HSA during the audit period. Excludes payroll 401(k) deferrals and investment returns.

### Total savings rate

**Label:** Total savings

**Formula:**

```
savingsInflows = payroll401kDeferrals + transferSavingsInflows
savingsRate = savingsInflows / periodNetPay
```

Total savings rate equals deferral rate plus cash surplus rate (within rounding). Investment returns (`investment_return` transactions) are excluded even when they increase brokerage, Roth, or 401(k) balances.

Denominator is net pay (not gross, not residual cash after rent).

V0 has no HSA account yet; include `hsa` in the account list so future HSA payroll deferrals count automatically.

---

## Legacy label

The field `savingsRate` on `AuditSnapshot` stores total savings rate for backward compatibility with narrative and history charts.

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
monthlyBurn = (
  rent + healthInsurance + utilities + groceries + subscriptions
  + childcare + federalWithholding + fica
  + creditCardInterest + studentLoanInterest + studentLoanPrincipal
) / periodMonths
runwayMonths = checkingBalance / monthlyBurn
```

Essential burn includes baseline living expenses posted each month from `packages/ledger/src/living-expenses.ts`:

| Category | Stub (single, solo lease) | Account |
|----------|---------------------------|---------|
| Health insurance | $140/mo (employer W2 plan) | `expense:healthInsurance` |
| Utilities | $185/mo × housing split | `expense:utilities` |
| Groceries | $600/mo base, modified by cooking skill and delivery frequency | `expense:groceries` |
| Subscriptions | $205/mo (subscriptions + cell + gym) | `expense:subscriptions` |

Groceries modifiers: takeout-only cooking skill +50%, expert -30%; delivery frequency adds up to +35% at high.

Utilities share uses the same housing arrangement fraction as rent (`housing-rent.ts`).

Savings rate is unchanged: intentional inflows over net pay only. Living expenses reduce checking but are not savings outflows.

---

## Baseline living expenses

**Source:** `packages/ledger/src/living-expenses.ts`, wired in `buildMonthlyTransactions` after payroll and before rent.

Character creator fields:

- `habits.cookingSkill` and `habits.deliveryFrequency` adjust groceries.
- `includeEmployerHealthPlan` (default on) gates health insurance for W2 employment.
- `location.housingArrangement` splits utilities like rent.

---

## Waterfall labels

Payroll income splits into separate waterfall lines:

- **Net pay to checking** (and **Partner net pay to checking** when applicable)
- **401(k) deferrals** (and **Partner 401(k) deferrals** when applicable)

Living expense lines: **Health insurance**, **Utilities**, **Groceries**, **Subscriptions**.

Market gains post as **Investment returns** under the `growth` category.

---

## Net-worth attribution

Six-month net-worth change decomposes into player choices, market luck, and lifestyle leakage.

### Contributions vs returns

```
contributionCents = sum(payroll 401k deferrals + transfer deposits to savings accounts)
returnCents = sum(investment_return net worth deltas by account)
```

Employer 401(k) match is not modeled in V0. HYSA interest posts as `investment_return` and counts in the return bucket.

### Choice vs luck

```
choiceCents = contributionCents + (net pay retained as asset growth, ex returns)
luckCents = returnCents (macro regime and market draw in V1)
lifestyleLeakageCents = sum(essential expense waterfall lines + student loan principal)
```

Attribution sums to net-worth delta within integer rounding (`residualCents` captures remainder).

Same-seed replay with different deferral rates shifts `choiceCents`, not `luckCents`, when macro seed is held constant.

---

## Implementation map

| Metric | Source |
|--------|--------|
| Savings rate, period net pay | `packages/ledger/src/metrics.ts` via `buildAuditSnapshot` |
| Metric breakdown for analysis UI | `metricBreakdown` on `AuditSnapshot` from `buildAuditSnapshot` |
| Ribbon take-home, housing burden, DTI | `apps/web/src/lib/play-session.ts` `computeRibbonMetrics` |
| Audit snapshot fields | `packages/shared/src/types/game-state.ts` `AuditSnapshot` |
| Rent split | `packages/shared/src/types/housing-rent.ts`, `build-game-state.ts` |
