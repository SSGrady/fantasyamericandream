'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseDeferral401kRateFromAction } from '../../../lib/parse-player-action';
import { runImpactPreview, savePlaySession } from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function ProcessingPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !session?.currentAudit) return;

    let cancelled = false;

    async function previewImpact() {
      const chosenDeferral401kRate = parseDeferral401kRateFromAction(
        session!.playerAction,
        session!.deferral401kRate,
      );

      try {
        const impactPreview = await runImpactPreview({
          startDate: session!.gameState.run.currentDate,
          randomSeed: session!.gameState.run.randomSeed,
          accounts: session!.gameState.accounts,
          debts: session!.gameState.debts,
          career: session!.gameState.career,
          location: session!.gameState.location,
          household: session!.gameState.household,
          player: {
            habits: session!.gameState.player.habits,
            includeEmployerHealthPlan: session!.gameState.player.includeEmployerHealthPlan,
            ageYears: session!.gameState.player.ageYears,
          },
          macro: session!.gameState.macro,
          deferral401kRate: session!.deferral401kRate,
          difficulty: session!.gameState.run.difficulty,
          enabledModules: session!.gameState.run.enabledModules,
          baselineDeferral401kRate: session!.deferral401kRate,
          chosenDeferral401kRate,
        });

        if (cancelled) return;

        const next = { ...session!, impactPreview };
        savePlaySession(next);
        setSession(next);
        router.replace('/play/analysis');
      } catch (previewError) {
        if (cancelled) return;
        setError(previewError instanceof Error ? previewError.message : 'Impact preview failed');
      }
    }

    void previewImpact();

    return () => {
      cancelled = true;
    };
  }, [ready, router, session, setSession]);

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
