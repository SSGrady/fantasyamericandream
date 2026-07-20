# Action Command Schema

Commands are discriminated by `type`. All variants include `id`, `type`, and `effectiveMonthKey` (YYYY-MM).

## Capacity

Default weekly capacity: **14 hours** (`data/calibration/command-capacity.json`). Passive finance commands cost 0 hours.

## V1 command types

| type | Capacity hrs/wk | Sim effect |
|------|-----------------|------------|
| set_401k_deferral_rate | 0 | Payroll deferral rate |
| set_roth_contribution_monthly | 0 | Roth IRA transfer after payday |
| set_hysa_auto_transfer | 0 | Checking to HYSA transfer |
| set_brokerage_auto_transfer | 0 | Checking to brokerage transfer |
| set_job_search_intensity | 2-8 | Layoff recovery modifier (stub) |
| set_delivery_spend_cap | 0 | Caps delivery habit tier |
| run_subscription_audit | 1 | Lowers subscription load |
| set_side_gig_hours | 1-10 | Extra income stub |
| set_relocation_intent | 2-6 | Narrative flag only V1 |
| set_emergency_fund_target | 0 | HYSA target (transfer boost) |
| set_student_loan_extra | 0 | Extra principal payment |
| set_credit_card_paydown | 0 | Extra CC payment |
| set_cooking_commitment | 1 | cookingSkill habit |
| set_coast_mode | 0 | Reduces job search capacity use |
| set_career_upskill_hours | 2-6 | Tenure/salary stub |

See `packages/shared/src/types/action-command.ts` for Zod schemas.
