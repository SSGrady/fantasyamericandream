'use client';

import type { V1CharacterDraft } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';

interface OnboardingPreviewRailProps {
  draft: V1CharacterDraft;
  step: number;
}

export function OnboardingPreviewRail({ draft, step }: OnboardingPreviewRailProps) {
  const checking = draft.balanceSheet.checking;
  const hysa = draft.balanceSheet.hysa;
  const liquid = checking + hysa;

  return (
    <aside className="sticky top-4 space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm lg:top-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Live preview · Step {step}/4</p>
      <p className="font-display text-lg text-ink">{draft.name || 'Your character'}</p>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted">State</dt>
          <dd className="font-medium text-ink">{draft.stateCode}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Liquid</dt>
          <dd className="font-medium text-ink">{formatMoney(liquid)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Priorities</dt>
          <dd className="font-medium text-ink text-right">
            {(draft.lifePriorities ?? []).slice(0, 3).join(', ') || 'Not set'}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
