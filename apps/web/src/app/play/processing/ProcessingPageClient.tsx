'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  applyTickToSession,
  computeImpactCacheKey,
  getDeferralFromCommands,
  runImpactPreview,
  runSimTick,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function ProcessingPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!ready || !session) return;
    if (session.currentAudit) {
      router.replace('/play/analysis');
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const abortController = new AbortController();
    const snapshot = session;
    const chosenDeferral401kRate = getDeferralFromCommands(snapshot);
    const cacheKey = computeImpactCacheKey(snapshot, chosenDeferral401kRate);

    async function runChapterSim() {
      try {
        const impactPreview = await runImpactPreview(
          {
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
          },
          abortController.signal,
        );

        if (abortController.signal.aborted) return;

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

        if (abortController.signal.aborted) return;

        const withPreview = {
          ...snapshot,
          impactPreview,
          impactPreviewCacheKey: cacheKey,
        };
        savePlaySession(withPreview);
        const updated = applyTickToSession(withPreview, tick);
        setSession(updated);
        router.replace('/play/analysis');
      } catch (previewError) {
        if (abortController.signal.aborted) return;
        setError(previewError instanceof Error ? previewError.message : 'Chapter simulation failed');
      } finally {
        inFlightRef.current = false;
      }
    }

    void runChapterSim();

    return () => {
      abortController.abort();
      inFlightRef.current = false;
    };
  }, [ready, router, session, setSession]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="mt-4 font-serif text-xl text-ink">Running chapter simulation…</p>
      <p className="mt-2 text-sm text-muted">
        {error ??
          'Computing impact preview and simulating six months with your submitted commands (same seed).'}
      </p>
    </div>
  );
}
