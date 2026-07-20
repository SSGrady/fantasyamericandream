'use client';

import type { ActionCommand, ActionCommandType } from '@fad/shared';
import {
  DEFAULT_COMMAND_STATE,
  formatCommandCapacityBadge,
  formatCommandPolicySummary,
  totalWeeklyCapacityUsed,
} from '@fad/shared';

function buildDefaultCommand(type: ActionCommandType, effectiveMonthKey: string): ActionCommand {
  const id = `cmd-${type}`;
  switch (type) {
    case 'set_401k_deferral_rate':
      return { id, type, effectiveMonthKey, rate: 0.1 };
    case 'set_roth_contribution_monthly':
      return { id, type, effectiveMonthKey, amountCents: 200_00 };
    case 'set_hysa_auto_transfer':
      return { id, type, effectiveMonthKey, amountCents: 300_00 };
    case 'set_brokerage_auto_transfer':
      return { id, type, effectiveMonthKey, amountCents: 150_00 };
    case 'set_job_search_intensity':
      return { id, type, effectiveMonthKey, intensity: 'medium' };
    case 'set_delivery_spend_cap':
      return { id, type, effectiveMonthKey, cap: 'low' };
    case 'run_subscription_audit':
      return { id, type, effectiveMonthKey, enabled: true };
    case 'set_side_gig_hours':
      return { id, type, effectiveMonthKey, hoursPerWeek: 4 };
    case 'set_relocation_intent':
      return { id, type, effectiveMonthKey, intent: 'exploring' };
    case 'set_emergency_fund_target':
      return { id, type, effectiveMonthKey, targetMonths: 3 };
    case 'set_student_loan_extra':
      return { id, type, effectiveMonthKey, extraPaymentCents: 100_00 };
    case 'set_credit_card_paydown':
      return { id, type, effectiveMonthKey, extraPaymentCents: 75_00 };
    case 'set_cooking_commitment':
      return { id, type, effectiveMonthKey, cookingSkill: 2 };
    case 'set_coast_mode':
      return { id, type, effectiveMonthKey, enabled: true };
    case 'set_career_upskill_hours':
      return { id, type, effectiveMonthKey, hoursPerWeek: 3 };
    default:
      throw new Error(`Unknown command type: ${type satisfies never}`);
  }
}

const COMMAND_CATALOG: {
  type: ActionCommandType;
  label: string;
  description: string;
}[] = [
  { type: 'set_401k_deferral_rate', label: '401(k) deferral rate', description: 'Payroll deferral percentage for the next chapter.' },
  { type: 'set_roth_contribution_monthly', label: 'Roth IRA monthly', description: 'Post-payday Roth transfer each month.' },
  { type: 'set_hysa_auto_transfer', label: 'HYSA auto-transfer', description: 'Move cash to high-yield savings after payday.' },
  { type: 'set_brokerage_auto_transfer', label: 'Brokerage auto-transfer', description: 'Invest surplus cash in taxable brokerage.' },
  { type: 'set_job_search_intensity', label: 'Job search intensity', description: 'Hours per week on applications and networking.' },
  { type: 'set_delivery_spend_cap', label: 'Delivery spend cap', description: 'Cap delivery app frequency.' },
  { type: 'run_subscription_audit', label: 'Subscription audit', description: 'Cancel unused subscriptions this chapter.' },
  { type: 'set_side_gig_hours', label: 'Side gig hours', description: 'Weekly freelance or gig hours.' },
  { type: 'set_relocation_intent', label: 'Relocation intent', description: 'Explore or actively pursue a move.' },
  { type: 'set_emergency_fund_target', label: 'Emergency fund target', description: 'Steer transfers toward runway months target.' },
  { type: 'set_student_loan_extra', label: 'Extra student loan payment', description: 'Additional principal beyond minimums.' },
  { type: 'set_credit_card_paydown', label: 'Credit card paydown', description: 'Extra payment toward card balance.' },
  { type: 'set_cooking_commitment', label: 'Cooking commitment', description: 'Shift groceries spend via cooking skill.' },
  { type: 'set_coast_mode', label: 'Coast mode', description: 'Reduce career grind for health and family.' },
  { type: 'set_career_upskill_hours', label: 'Career upskill hours', description: 'Weekly learning for raises and promotions.' },
];

interface CommandCenterProps {
  effectiveMonthKey: string;
  commands: ActionCommand[];
  capacityError: string | null;
  onCommandsChange: (commands: ActionCommand[]) => void;
}

export function CommandCenter({
  effectiveMonthKey,
  commands,
  capacityError,
  onCommandsChange,
}: CommandCenterProps) {
  const weeklyLimit = DEFAULT_COMMAND_STATE.weeklyCapacityHours;
  const used = totalWeeklyCapacityUsed(commands);

  const toggleCommand = (type: ActionCommandType) => {
    const existing = commands.find((command) => command.type === type);
    if (existing) {
      onCommandsChange(commands.filter((command) => command.type !== type));
      return;
    }

    const next = buildDefaultCommand(type, effectiveMonthKey);
    next.id = `cmd-${type}-${Date.now()}`;
    onCommandsChange([...commands, next]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Weekly capacity</p>
            <p className="mt-1 text-sm text-ink">
              {used}h / {weeklyLimit}h used
            </p>
          </div>
          <div
            className={`h-2 max-w-xs flex-1 overflow-hidden rounded-full bg-surface ${
              used > weeklyLimit ? 'ring-2 ring-amber-400' : ''
            }`}
          >
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min(100, (used / weeklyLimit) * 100)}%` }}
            />
          </div>
        </div>
        {capacityError ? <p className="mt-2 text-sm text-amber-700">{capacityError}</p> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMMAND_CATALOG.map((entry) => {
          const activeCommand = commands.find((command) => command.type === entry.type);
          const active = Boolean(activeCommand);
          const policyLabel = activeCommand
            ? formatCommandPolicySummary(activeCommand)
            : null;
          const capacityHint = formatCommandCapacityBadge(
            buildDefaultCommand(entry.type, effectiveMonthKey),
          );
          const badge = policyLabel ?? capacityHint;
          return (
            <button
              key={entry.type}
              type="button"
              onClick={() => toggleCommand(entry.type)}
              className={`rounded-lg border p-4 text-left shadow-sm transition ${
                active
                  ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                  : 'border-border bg-card hover:border-accent/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{entry.label}</p>
                {badge ? <span className="text-xs text-muted">{badge}</span> : null}
              </div>
              <p className="mt-1 text-xs text-muted">{entry.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
