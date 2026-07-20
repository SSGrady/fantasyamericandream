'use client';

import type { RunState } from '@fad/domain';
import { selectRibbonMetrics } from '@fad/domain';
import { DEFAULT_COMMAND_STATE, totalWeeklyCapacityUsed } from '@fad/shared';
import { useEffect, useMemo, useState } from 'react';
import {
  computeImpactCacheKey,
  getDeferralFromCommands,
  runImpactPreview,
} from '../../lib/play-session';
import { CommandCenter } from './CommandCenter';
import { DirectionalPreview } from './DirectionalPreview';
import { MoneyPolicySliders } from './MoneyPolicySliders';
import { TimeCapacityPanel } from './TimeCapacityPanel';

interface InteractivePlanningPanelProps {
  session: RunState;
  dirty: boolean;
  onCommandsChange: (commands: RunState['commandDraft']) => void;
  onCommit: () => void;
}

export function InteractivePlanningPanel({
  session,
  dirty,
  onCommandsChange,
  onCommit,
}: InteractivePlanningPanelProps) {
  const effectiveMonthKey = session.chapterPeriod.openingDate.slice(0, 7);
  const weeklyLimit =
    session.gameState.commandState?.weeklyCapacityHours ?? DEFAULT_COMMAND_STATE.weeklyCapacityHours;
  const metrics = selectRibbonMetrics(session);
  const monthlyNetPay = metrics.takeHomePayMonthly;

  const [previewDelta, setPreviewDelta] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const deferralFromCommands = useMemo(
    () => getDeferralFromCommands(session),
    [session],
  );

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setPreviewLoading(true);
      void runImpactPreview({
        startDate: session.gameState.run.currentDate,
        randomSeed: session.gameState.run.randomSeed,
        accounts: session.gameState.accounts,
        debts: session.gameState.debts,
        career: session.gameState.career,
        location: session.gameState.location,
        household: session.gameState.household,
        player: {
          habits: session.gameState.player.habits,
          includeEmployerHealthPlan: session.gameState.player.includeEmployerHealthPlan,
          ageYears: session.gameState.player.ageYears,
        },
        macro: session.gameState.macro,
        deferral401kRate: session.deferral401kRate,
        difficulty: session.gameState.run.difficulty,
        enabledModules: session.gameState.run.enabledModules,
        baselineDeferral401kRate: session.deferral401kRate,
        chosenDeferral401kRate: deferralFromCommands,
        activeCommands: session.commandDraft,
        baselineCommands: session.gameState.commandState?.activeCommands,
      })
        .then((preview) => {
          if (cancelled) return;
          setPreviewDelta(preview.deltaNetWorth);
        })
        .catch(() => {
          if (cancelled) return;
          setPreviewDelta(null);
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [session, deferralFromCommands]);

  const capacityUsed = totalWeeklyCapacityUsed(session.commandDraft);
  const sideGig = session.commandDraft.find((command) => command.type === 'set_side_gig_hours');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <MoneyPolicySliders
          commands={session.commandDraft}
          effectiveMonthKey={effectiveMonthKey}
          monthlyNetPayCents={monthlyNetPay}
          onChange={onCommandsChange}
        />
        <TimeCapacityPanel
          commands={session.commandDraft}
          effectiveMonthKey={effectiveMonthKey}
          weeklyLimit={weeklyLimit}
          onChange={onCommandsChange}
        />
      </div>

      {sideGig && sideGig.type === 'set_side_gig_hours' && sideGig.hoursPerWeek > 0 ? (
        <p className="rounded-md bg-surface px-3 py-2 text-sm text-muted">
          Side gig at {sideGig.hoursPerWeek}h/wk may lift monthly savings; watch capacity overlap with
          upskill hours.
        </p>
      ) : null}

      <CommandCenter
        effectiveMonthKey={effectiveMonthKey}
        commands={session.commandDraft}
        capacityError={session.commandCapacityError}
        onChange={onCommandsChange}
      />

      <div className="sticky bottom-0 rounded-lg border border-border bg-card/95 p-4 shadow-sm backdrop-blur card-preview">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            {previewLoading ? (
              'Updating live preview…'
            ) : (
              <>
                <DirectionalPreview
                  deltaNetWorth={previewDelta}
                  loading={previewLoading}
                  isFlat={previewDelta === 0}
                />
                {` · Capacity ${capacityUsed}h/${weeklyLimit}h`}
                {dirty ? ' · Uncommitted changes' : ' · Plan matches committed state'}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onCommit}
            disabled={!dirty && previewDelta === 0}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Commit plan
          </button>
        </div>
      </div>
    </div>
  );
}
