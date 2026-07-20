'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { parseDeferral401kRateFromAction } from '../../../lib/parse-player-action';
import {
  computeImpactCacheKey,
  runImpactPreview,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function ProcessingPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    if (!ready || !session?.currentAudit) return;

    const current = sessionRef.current;
    if (!current) return;

    const chosenDeferral401kRate = parseDeferral401kRateFromAction(
      current.playerAction,
      current.deferral401kRate,
    );
    const cacheKey = computeImpactCacheKey(current, chosenDeferral401kRate);

    if (current.impactPreview && current.impactPreviewCacheKey === cacheKey) {
      router.replace('/play/analysis');
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const abortController = new AbortController();

    async function previewImpact() {
      try {
        const impactPreview = await runImpactPreview(
          {
            startDate: current!.gameState.run.currentDate,
            randomSeed: current!.gameState.run.randomSeed,
            accounts: current!.gameState.accounts,
            debts: current!.gameState.debts,
            career: current!.gameState.career,
            location: current!.gameState.location,
            household: current!.gameState.household,
            player: {
              habits: current!.gameState.player.habits,
              includeEmployerHealthPlan: current!.gameState.player.includeEmployerHealthPlan,
              ageYears: current!.gameState.player.ageYears,
            },
            macro: current!.gameState.macro,
            deferral401kRate: current!.deferral401kRate,
            difficulty: current!.gameState.run.difficulty,
            enabledModules: current!.gameState.run.enabledModules,
            baselineDeferral401kRate: current!.deferral401kRate,
            chosenDeferral401kRate,
          },
          abortController.signal,
        );

        if (abortController.signal.aborted) return;

        const next = {
          ...current!,
          impactPreview,
          impactPreviewCacheKey: cacheKey,
        };
        savePlaySession(next);
        setSession(next);
        router.replace('/play/analysis');
      } catch (previewError) {
        if (abortController.signal.aborted) return;
        setError(previewError instanceof Error ? previewError.message : 'Impact preview failed');
      } finally {
        inFlightRef.current = false;
      }
    }

    void previewImpact();

    return () => {
      abortController.abort();
      inFlightRef.current = false;
    };
  }, [ready, router, setSession]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="mt-4 font-serif text-xl text-ink">Analyzing impact…</p>
      <p className="mt-2 text-sm text-muted">
        {error ??
          'Running baseline vs chosen counterfactual for your submitted action (same seed, six-month horizon).'}
      </p>
    </div>
  );
}
