'use client';

import { chapterShellPathWithStage, chapterSimMonthLabels, interruptMonthIndex } from '@fad/domain';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LiveMonthRail, type MonthOutcome } from '../../../components/play/LiveMonthRail';
import {
  applyTickToSession,
  computeImpactCacheKey,
  getDeferralFromCommands,
  recordDecision,
  resolveChapterInterrupt,
  rollChapterInterruptForSession,
  runImpactPreview,
  runSimTick,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

const MONTH_STEP_MS = 480;

export function ProcessingPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [error, setError] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const [interruptPending, setInterruptPending] = useState(false);
  const simDoneRef = useRef(false);

  const months = session ? chapterSimMonthLabels(session.chapterPeriod) : [];
  const interrupt = session?.activeInterrupt ?? null;
  const interruptAt = interrupt ? interruptMonthIndex(interrupt) : -1;

  useEffect(() => {
    if (!ready || !session || session.activeInterrupt) return;
    const withInterrupt = rollChapterInterruptForSession(session);
    if (withInterrupt !== session) setSession(withInterrupt);
  }, [ready, session, setSession]);

  const runSimulation = useCallback(async () => {
    if (!session || simDoneRef.current) return;
    simDoneRef.current = true;

    const snapshot = session;
    const chosenDeferral401kRate = getDeferralFromCommands(snapshot);
    const cacheKey = computeImpactCacheKey(snapshot, chosenDeferral401kRate);

    try {
      const impactPreview = await runImpactPreview({
        startDate: snapshot.gameState.run.currentDate,
        randomSeed: snapshot.gameState.run.randomSeed,
        accounts: snapshot.gameState.accounts,
        debts: snapshot.gameState.debts,
        career: snapshot.gameState.career,
        location: snapshot.gameState.location,
        household: snapshot.gameState.household,
        player: {
          habits: snapshot.gameState.player.habits,
          includeEmployerHealthPlan: snapshot.gameState.player.includeEmployerHealthPlan,
          ageYears: snapshot.gameState.player.ageYears,
        },
        macro: snapshot.gameState.macro,
        deferral401kRate: snapshot.deferral401kRate,
        difficulty: snapshot.gameState.run.difficulty,
        enabledModules: snapshot.gameState.run.enabledModules,
        baselineDeferral401kRate: snapshot.deferral401kRate,
        chosenDeferral401kRate,
        activeCommands: snapshot.commandDraft,
        baselineCommands: snapshot.gameState.commandState?.activeCommands,
      });

      const tick = await runSimTick({
        startDate: snapshot.gameState.run.currentDate,
        randomSeed: snapshot.gameState.run.randomSeed,
        accounts: snapshot.gameState.accounts,
        debts: snapshot.gameState.debts,
        career: snapshot.gameState.career,
        location: snapshot.gameState.location,
        household: snapshot.gameState.household,
        player: {
          habits: snapshot.gameState.player.habits,
          includeEmployerHealthPlan: snapshot.gameState.player.includeEmployerHealthPlan,
          ageYears: snapshot.gameState.player.ageYears,
        },
        macro: snapshot.gameState.macro,
        deferral401kRate: chosenDeferral401kRate,
        difficulty: snapshot.gameState.run.difficulty,
        enabledModules: snapshot.gameState.run.enabledModules,
        activeCommands: snapshot.commandDraft,
        weeklyCapacityHours: snapshot.gameState.commandState?.weeklyCapacityHours,
      });

      const withPreview = {
        ...snapshot,
        impactPreview,
        impactPreviewCacheKey: cacheKey,
        monthsCompleted: months.length,
      };
      savePlaySession(withPreview);
      const updated = applyTickToSession(withPreview, tick);
      setSession(updated);
      router.replace(
        chapterShellPathWithStage(
          snapshot.gameState.run.id,
          snapshot.periodIndex + 1,
          'chapterClose',
          'story',
        ),
      );
    } catch (previewError) {
      simDoneRef.current = false;
      setError(previewError instanceof Error ? previewError.message : 'Chapter simulation failed');
    }
  }, [session, setSession, router, months.length]);

  useEffect(() => {
    if (!ready || !session || session.currentAudit) return;
    if (interruptPending) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let monthCursor = session.monthsCompleted ?? 0;
    setActiveMonth(monthCursor);

    if (reducedMotion) {
      setActiveMonth(Math.max(0, months.length - 1));
      void runSimulation();
      return;
    }

    const timer = window.setInterval(() => {
      if (interrupt && interruptAt >= 0 && monthCursor + 1 === interruptAt) {
        window.clearInterval(timer);
        setInterruptPending(true);
        setActiveMonth(interruptAt);
        return;
      }
      if (monthCursor >= months.length - 1) {
        window.clearInterval(timer);
        void runSimulation();
        return;
      }
      monthCursor += 1;
      setActiveMonth(monthCursor);
    }, MONTH_STEP_MS);

    return () => window.clearInterval(timer);
  }, [ready, session, months.length, interrupt, interruptAt, interruptPending, runSimulation]);

  const handleInterruptResolve = (choiceId: string) => {
    if (!session) return;
    const resolved = resolveChapterInterrupt(session, choiceId);
    const logged = recordDecision(resolved, 'interrupt_resolved', {
      interruptId: session.activeInterrupt?.id,
      choiceId,
    });
    setSession({ ...logged, monthsCompleted: interruptAt + 1 });
    setInterruptPending(false);
    setActiveMonth(Math.max(activeMonth, interruptAt));
    simDoneRef.current = false;
    void runSimulation();
  };

  const outcomes: MonthOutcome[] = months.map((_, index) =>
    index < activeMonth ? { glyph: 'flat' } : { glyph: 'pending' },
  );

  return (
    <div className="space-y-6">
      {months.length > 0 ? (
        <LiveMonthRail
          months={months}
          activeIndex={activeMonth}
          completedOutcomes={outcomes}
          interrupt={interrupt}
          interruptPending={interruptPending}
          onInterruptResolve={handleInterruptResolve}
        />
      ) : null}
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center shadow-sm">
        {!interruptPending ? (
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        ) : null}
        <p className="mt-4 font-serif text-xl text-ink">
          {interruptPending ? 'Decision required' : 'Living the chapter…'}
        </p>
        <p className="mt-2 text-sm text-muted">
          {error ??
            (interruptPending
              ? 'Respond to the interrupt to continue the remaining months.'
              : `Simulating ${months[activeMonth] ?? '…'} with your committed plan.`)}
        </p>
      </div>
    </div>
  );
}
