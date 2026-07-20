# Ledger Invariants

The ledger engine (`packages/ledger/`) must enforce these rules on every transaction batch.

## Accounting

1. **Balance equation:** `netWorth = sum(assets) - sum(liabilities)` after every apply.
2. **Double-entry:** Each `LedgerTransaction` has balanced debit/credit lines.
3. **No silent cash creation** - every asset increase has a source (income, transfer, return).
4. **Integer cents** - no floating-point accumulation; round once at display boundary.

## Debt

5. **Principal monotonicity** - principal never increases except explicit new borrowing events.
6. **Interest accrual** - computed on outstanding principal at stated APR; posted as separate line.
7. **Payment allocation** - interest first, then principal (unless documented alternate).

## Tax-advantaged accounts

8. **401(k) deferral limit** - cumulative employee deferrals ≤ IRS limit for `taxYear`.
9. **IRA limit** - combined Roth/traditional contributions ≤ IRA limit.
10. **HSA limit** - if HDHP eligible, contributions ≤ family/individual limit.
11. **Employer match** - does not count toward employee deferral limit.

## Equity compensation

12. **Unvested RSU** - tracked in `CareerState.equity`; not in liquid `Accounts` until vest event.
13. **Single vest** - each tranche vests once; vest posts income + withholding + share deposit.

## Credit

14. **Statement balance** - minimum payment computed correctly; APR applies to carried balance only.
15. **Utilization** - computed as balance / limit; no magic score formula in V0.

## Reproducibility

16. **Deterministic apply order** - transactions within a month sorted by stable ID before apply.
17. **Replay** - `hash(runState at month M)` identical for same seed + choices.

## Testing

Each invariant maps to a Vitest case in `packages/ledger/src/__tests__/invariants.test.ts`.

Golden files: `packages/ledger/src/__tests__/fixtures/*.json`
