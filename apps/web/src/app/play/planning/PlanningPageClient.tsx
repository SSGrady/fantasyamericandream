'use client';

import {
  CA_ENGINEER_2026,
  canAccessPlanning,
  chapterShellPathWithStage,
  deferralRateFromOffer,
  formatSimWindowRange,
  resolveJobOffer,
} from '@fad/domain';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { JobOfferPicker } from '../../../components/create/JobOfferPicker';
import { CommandCenter } from '../../../components/play/CommandCenter';
import { formatMoney } from '../../../lib/format-money';
import {
  acceptJobOffer,
  commitCommandDraft,
  resolveSessionPlanningMode,
  setChapterStage,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function PlanningPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const chapter = CA_ENGINEER_2026;
  const offers = chapter.jobOffers;

  const planningMode = session ? resolveSessionPlanningMode(session) : 'recurringPlan';

  useEffect(() => {
    if (!ready || !session) return;
    if (session.currentAudit || !canAccessPlanning(session.chapterPeriod.status)) {
      router.replace(
        chapterShellPathWithStage(
          session.gameState.run.id,
          session.periodIndex + 1,
          session.currentAudit ? 'chapterClose' : 'openingBriefing',
        ),
      );
    }
  }, [ready, session, router]);

  const currentOffer = useMemo(() => {
    if (!session) return null;
    return resolveJobOffer(chapter, session.acceptedOfferId ?? chapter.defaultOfferId);
  }, [session, chapter]);

  useEffect(() => {
    if (!session) return;
    if (planningMode === 'interruptJobOffer') {
      setSelectedOfferId(chapter.counterfactualOfferId);
      return;
    }
    if (planningMode === 'initialPlan') {
      setSelectedOfferId(session.acceptedOfferId ?? chapter.defaultOfferId);
    }
  }, [session, planningMode, chapter]);

  const selectedOffer =
    planningMode === 'interruptJobOffer' || planningMode === 'initialPlan'
      ? resolveJobOffer(chapter, selectedOfferId ?? chapter.defaultOfferId)
      : currentOffer;

  const planLabel = session
    ? `Plan ${formatSimWindowRange(session.chapterPeriod)}`
    : 'Plan next six months';

  const effectiveMonthKey = session?.chapterPeriod.openingDate.slice(0, 7) ?? '2026-01';

  const handleContinue = () => {
    if (!session) return;

    if (planningMode === 'interruptJobOffer' || planningMode === 'initialPlan') {
      if (!selectedOfferId) return;
      const withOffer = acceptJobOffer(session, selectedOfferId);
      const committed = commitCommandDraft(withOffer);
      const staged = setChapterStage(committed, 'simulating');
      setSession(staged);
      router.push(
        chapterShellPathWithStage(session.gameState.run.id, session.periodIndex + 1, 'simulating'),
      );
      return;
    }

    const committed = commitCommandDraft({
      ...session,
      commandCapacityError: null,
    });
    setSession(committed);
    if (committed.commandCapacityError) return;
    const staged = setChapterStage(committed, 'simulating');
    setSession(staged);
    router.push(
      chapterShellPathWithStage(session.gameState.run.id, session.periodIndex + 1, 'simulating'),
    );
  };

  if (!ready || !session) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading chapter planning…
      </div>
    );
  }

  if (planningMode === 'interruptJobOffer' || planningMode === 'initialPlan') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-accent">
            {planningMode === 'interruptJobOffer' ? 'Competing offer' : chapter.title}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-ink">
            {planningMode === 'interruptJobOffer' ? 'Respond to the counter-offer' : 'Confirm your starting offer'}
          </h2>
          <p className="mt-3 text-muted">
            {planningMode === 'interruptJobOffer'
              ? session.activeInterrupt?.description
              : 'Your onboarding choice carries into the simulation. Confirm or change it before setting chapter commands.'}
          </p>
        </div>

        <JobOfferPicker
          offers={offers}
          selectedOfferId={selectedOfferId}
          onSelect={setSelectedOfferId}
          showCustom={planningMode === 'initialPlan'}
          customSelected={selectedOfferId === 'custom'}
        />

        <div className="flex justify-end border-t border-border pt-6">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedOfferId}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Continue to commands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">{planLabel}</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Set chapter commands</h2>
        <p className="mt-3 text-muted">
          {selectedOffer
            ? `${selectedOffer.employer} · ${formatMoney(selectedOffer.baseSalaryAnnual)}/yr · ${Math.round(deferralRateFromOffer(selectedOffer) * 100)}% deferral`
            : 'Configure persistent actions before decision day.'}
        </p>
      </div>

      <CommandCenter
        effectiveMonthKey={effectiveMonthKey}
        commands={session.commandDraft}
        capacityError={session.commandCapacityError}
        onChange={(commands) =>
          setSession({
            ...session,
            commandDraft: commands,
            commandCapacityError: null,
          })
        }
      />

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() =>
            router.push(
              chapterShellPathWithStage(
                session.gameState.run.id,
                session.periodIndex + 1,
                'openingBriefing',
              ),
            )
          }
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to briefing
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to decision day
        </button>
      </div>
    </div>
  );
}
