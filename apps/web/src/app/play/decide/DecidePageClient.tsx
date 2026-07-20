'use client';

import { chapterShellPathWithStage, chapterSimMonthLabels } from '@fad/domain';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DirectionalPreview } from '../../../components/play/DirectionalPreview';
import { LiteracyQuizStub } from '../../../components/play/LiteracyQuizStub';
import { LiveMonthRail } from '../../../components/play/LiveMonthRail';
import { PriorityDeltaBadges } from '../../../components/play/PriorityDeltaBadges';
import { formatMoney } from '../../../lib/format-money';
import {
  canSubmitDecisionDayCommands,
  commitCommandDraft,
  computeImpactCacheKey,
  getDeferralFromCommands,
  recordDecision,
  resolveChapterInterrupt,
  runImpactPreview,
  savePlaySession,
  setChapterStage,
  unlockLiteracySkill,
  validateCommandDraftEffect,
  type PendingDecision,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';
import {
  filterDeltasForPriorities,
  interruptChoiceDeltas,
  planChoiceDeltas,
} from '../../../lib/priority-deltas';

export function DecidePageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [action, setAction] = useState('');
  const [previewDelta, setPreviewDelta] = useState<number | null>(null);
  const [previewRunway, setPreviewRunway] = useState<number | null>(null);
  const [previewReason, setPreviewReason] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!ready || !session) return;
    if (session.currentAudit) {
      router.replace(
        chapterShellPathWithStage(
          session.gameState.run.id,
          session.periodIndex + 1,
          'chapterClose',
        ),
      );
    }
  }, [ready, session, router]);

  useEffect(() => {
    if (session?.playerAction) {
      setAction(session.playerAction);
    }
  }, [session?.playerAction]);

  const deferralFromCommands = useMemo(
    () => (session ? getDeferralFromCommands(session) : 0.1),
    [session],
  );

  const commandEffect = useMemo(
    () => (session ? validateCommandDraftEffect(session) : { hasEffect: false }),
    [session],
  );

  useEffect(() => {
    if (!session || session.currentAudit) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (!commandEffect.hasEffect) {
        setPreviewDelta(0);
        setPreviewRunway(0);
        setPreviewReason(commandEffect.reason ?? 'No change vs current plan.');
        setPreviewLoading(false);
        return;
      }

      const cacheKey = computeImpactCacheKey(session, deferralFromCommands);
      if (session.impactPreview && session.impactPreviewCacheKey === cacheKey) {
        setPreviewDelta(session.impactPreview.deltaNetWorth);
        setPreviewRunway(session.impactPreview.deltaRunwayMonths);
        setPreviewReason(session.impactPreview.flatPreviewReason ?? null);
        return;
      }

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
          setPreviewRunway(preview.deltaRunwayMonths);
          setPreviewReason(preview.flatPreviewReason ?? null);
        })
        .catch(() => {
          if (cancelled) return;
          setPreviewDelta(null);
          setPreviewRunway(null);
          setPreviewReason(null);
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [session, deferralFromCommands, commandEffect]);

  const months = session ? chapterSimMonthLabels(session.chapterPeriod) : [];
  const planDeltas = filterDeltasForPriorities(
    planChoiceDeltas('commit_plan'),
    session?.lifePriorities,
  );

  if (!ready || !session) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading decision day…
      </div>
    );
  }

  const submitGate = useMemo(
    () => (session ? canSubmitDecisionDayCommands(session) : { ok: false }),
    [session],
  );
  const canSubmit = submitGate.ok;

  const handleContinue = () => {
    if (!canSubmit) return;

    const withAction = recordDecision(
      {
        ...session,
        playerAction: action.trim(),
        chapterPeriod: { ...session.chapterPeriod, status: 'in_progress' as const },
        impactPreview: null,
        impactPreviewCacheKey: null,
      },
      'commands_submitted',
      { commands: session.commandDraft, playerAction: action.trim() },
    );
    const committed = commitCommandDraft(withAction);
    const staged = setChapterStage(committed, 'simulating');
    setSession(staged);
    if (committed.commandCapacityError) {
      return;
    }
    router.push(
      chapterShellPathWithStage(session.gameState.run.id, session.periodIndex + 1, 'simulating'),
    );
  };

  const handleQuizAnswer = (correct: boolean) => {
    let next = { ...session, literacyQuizAnswered: true };
    if (correct) {
      next = unlockLiteracySkill(next, 'investing_i');
    }
    savePlaySession(next);
    setSession(next);
  };

  return (
    <div className="space-y-6">
      {months.length > 0 ? (
        <LiveMonthRail
          months={months}
          activeIndex={0}
          interrupt={session.activeInterrupt}
          interruptPending={Boolean(session.activeInterrupt)}
          onInterruptResolve={(choiceId) => {
            const resolved = resolveChapterInterrupt(session, choiceId);
            const deltas = session.activeInterrupt
              ? filterDeltasForPriorities(
                  interruptChoiceDeltas(session.activeInterrupt, choiceId),
                  session.lifePriorities,
                )
              : [];
            const logged = recordDecision(resolved, 'interrupt_resolved', {
              interruptId: session.activeInterrupt?.id,
              choiceId,
              priorityDeltas: deltas,
            });
            setSession(logged);
          }}
        />
      ) : null}

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Decision day</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Commit and live the chapter</h2>
        <p className="mt-3 text-muted">
          Review your plan, resolve any interrupts on the timeline, then submit to run the six-month
          window.
        </p>
        {planDeltas.length > 0 ? (
          <div className="mt-3">
            <PriorityDeltaBadges deltas={planDeltas} />
          </div>
        ) : null}
      </div>

      <LiteracyQuizStub
        answered={session.literacyQuizAnswered ?? false}
        onAnswer={handleQuizAnswer}
        eventContext={session.activeInterrupt?.type ?? 'decision_day'}
      />

      <div className="card-preview rounded-lg border border-dashed border-border bg-surface p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Consequence preview</p>
        <div className="mt-2">
          <DirectionalPreview
            deltaNetWorth={previewDelta}
            deltaRunwayMonths={previewRunway}
            isFlat={previewDelta === 0}
            flatReason={previewReason}
            loading={previewLoading}
          />
        </div>
      </div>

      <div className="space-y-4">
        {session.pendingDecisions.map((decision: PendingDecision) => (
          <div key={decision.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {decision.kind === 'required' ? 'Required' : 'Opportunity'}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{decision.title}</h3>
                <p className="mt-1 text-sm text-muted">{decision.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <label htmlFor="player-action" className="text-sm font-medium text-ink">
          Free-text action (optional)
        </label>
        <textarea
          id="player-action"
          rows={3}
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Example: increase deferrals to 12%, pause delivery apps."
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.push('/play/planning')}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to planning
        </button>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {!canSubmit && submitGate.reason ? (
            <p className="text-sm text-muted">{submitGate.reason}</p>
          ) : null}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Submit commands
          </button>
        </div>
      </div>
    </div>
  );
}
