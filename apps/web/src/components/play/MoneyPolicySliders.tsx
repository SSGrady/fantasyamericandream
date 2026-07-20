'use client';

import type { ActionCommand } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';
import { parseRangeInputValue } from '../../lib/parse-slider-value';

const MONEY_TYPES = [
  'set_401k_deferral_rate',
  'set_roth_contribution_monthly',
  'set_hysa_auto_transfer',
  'set_delivery_spend_cap',
] as const;

type MoneyCommandType = (typeof MONEY_TYPES)[number];

function findCommand<T extends ActionCommand['type']>(
  commands: ActionCommand[],
  type: T,
): Extract<ActionCommand, { type: T }> | undefined {
  return commands.find((command): command is Extract<ActionCommand, { type: T }> => command.type === type);
}

interface MoneyPolicySlidersProps {
  commands: ActionCommand[];
  effectiveMonthKey: string;
  monthlyNetPayCents: number;
  onCommandsChange: (commands: ActionCommand[]) => void;
}

function upsertCommand(commands: ActionCommand[], next: ActionCommand): ActionCommand[] {
  const filtered = commands.filter((command) => command.type !== next.type);
  return [...filtered, next];
}

export function MoneyPolicySliders({
  commands,
  effectiveMonthKey,
  monthlyNetPayCents,
  onCommandsChange,
}: MoneyPolicySlidersProps) {
  const deferral = findCommand(commands, 'set_401k_deferral_rate');
  const roth = findCommand(commands, 'set_roth_contribution_monthly');
  const hysa = findCommand(commands, 'set_hysa_auto_transfer');
  const delivery = findCommand(commands, 'set_delivery_spend_cap');

  const deferralRate = deferral?.rate ?? 0.1;
  const rothCents = roth?.amountCents ?? 0;
  const hysaCents = hysa?.amountCents ?? 0;
  const deliveryCap = delivery?.cap ?? 'medium';

  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Money policies</p>
        <p className="mt-1 text-sm text-muted">Adjust payroll and transfer knobs. 1% steps on deferrals.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">
          401(k) deferral · {Math.round(deferralRate * 100)}%
          {monthlyNetPayCents > 0 ? (
            <span className="ml-2 text-muted">
              (~{formatMoney(Math.round(monthlyNetPayCents * deferralRate))}/mo)
            </span>
          ) : null}
        </span>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={Math.round(deferralRate * 100)}
          onChange={(event) => {
            const pct = parseRangeInputValue(event, Math.round(deferralRate * 100));
            onCommandsChange(
              upsertCommand(commands, {
                id: deferral?.id ?? `cmd-401k-${Date.now()}`,
                type: 'set_401k_deferral_rate',
                effectiveMonthKey,
                rate: pct / 100,
              }),
            );
          }}
          className="w-full accent-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">Roth IRA monthly · {formatMoney(rothCents)}</span>
        <input
          type="range"
          min={0}
          max={583}
          step={25}
          value={rothCents / 100}
          onChange={(event) => {
            const dollars = parseRangeInputValue(event, rothCents / 100);
            onCommandsChange(
              upsertCommand(commands, {
                id: roth?.id ?? `cmd-roth-${Date.now()}`,
                type: 'set_roth_contribution_monthly',
                effectiveMonthKey,
                amountCents: dollars * 100,
              }),
            );
          }}
          className="w-full accent-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">HYSA auto-transfer · {formatMoney(hysaCents)}</span>
        <input
          type="range"
          min={0}
          max={1500}
          step={50}
          value={hysaCents / 100}
          onChange={(event) => {
            const dollars = parseRangeInputValue(event, hysaCents / 100);
            onCommandsChange(
              upsertCommand(commands, {
                id: hysa?.id ?? `cmd-hysa-${Date.now()}`,
                type: 'set_hysa_auto_transfer',
                effectiveMonthKey,
                amountCents: dollars * 100,
              }),
            );
          }}
          className="w-full accent-accent"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Delivery spend cap</legend>
        <div className="flex flex-wrap gap-2">
          {(['none', 'low', 'medium', 'high'] as const).map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() =>
                onCommandsChange(
                  upsertCommand(commands, {
                    id: delivery?.id ?? `cmd-delivery-${Date.now()}`,
                    type: 'set_delivery_spend_cap',
                    effectiveMonthKey,
                    cap,
                  }),
                )
              }
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                deliveryCap === cap ? 'bg-accent text-white' : 'bg-surface text-muted'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

export function isMoneyCommand(type: ActionCommand['type']): type is MoneyCommandType {
  return (MONEY_TYPES as readonly string[]).includes(type);
}
