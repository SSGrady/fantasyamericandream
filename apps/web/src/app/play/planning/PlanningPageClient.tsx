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
import { InteractivePlanningPanel } from '../../../components/play/InteractivePlanningPanel';
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

  const planDirty = useMemo(() => {
    if (!session) return false;
    const active = session.gameState.commandState?.activeCommands ?? [];
    if (session.commandDraft.length !== active.length) return true;
    const draftSig = session.commandDraft.map((c) => JSON.stringify(c)).sort().join('|');
    const activeSig = active.map((c) => JSON.stringify(c)).sort().join('|');
    return draftSig !== activeSig;
  }, [session]);

  const goToSimulating = (nextSession: typeof session) => {
    if (!nextSession) return;
    const staged = setChapterStage(nextSession, 'simulating');
    setSession(staged);
    router.push(
      chapterShellPathWithStage(nextSession.gameState.run.id, nextSession.periodIndex + 1, 'simulating'),
    );
  };

  const handleOfferContinue = () => {
    if (!session || !selectedOfferId) return;
    const withOffer = acceptJobOffer(session, selectedOfferId);
    const committed = commitCommandDraft(withOffer);
    setSession(committed);
    if (committed.commandCapacityError) return;
    goToSimulating(committed);
  };

  const handleCommitPlan = () => {
    if (!session) return;
    const committed = commitCommandDraft({ ...session, commandCapacityError: null });
    setSession(committed);
    if (committed.commandCapacityError) return;
    goToSimulating(committed);
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
            {planningMode === 'interruptJobOffer'
              ? 'Respond to the counter-offer'
              : 'Confirm your starting offer'}
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
            onClick={handleOfferContinue}
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
        <h2 className="mt-1 font-serif text-2xl text-ink">Interactive chapter plan</h2>
        <p className="mt-3 text-muted">
          {selectedOffer
            ? `${selectedOffer.employer} · ${formatMoney(selectedOffer.baseSalaryAnnual)}/yr · ${Math.round(deferralRateFromOffer(selectedOffer) * 100)}% deferral`
            : 'Configure money and time policies before living the chapter.'}
        </p>
      </div>

      <InteractivePlanningPanel
        session={session}
        dirty={planDirty}
        onCommandsChange={(commands) =>
          setSession({ ...session, commandDraft: commands, commandCapacityError: null })
        }
        onCommit={handleCommitPlan}
      />
    </div>
  );
}
