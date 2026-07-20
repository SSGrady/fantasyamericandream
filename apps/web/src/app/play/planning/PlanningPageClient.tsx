'use client';

import {
  CA_ENGINEER_2026,
  deferralRateFromOffer,
  resolveJobOffer,
} from '@fad/domain';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { JobOfferPicker } from '../../../components/create/JobOfferPicker';
import { CommandCenter } from '../../../components/play/CommandCenter';
import { formatMoney } from '../../../lib/format-money';
import {
  applyJobOfferToSession,
  commitCommandDraft,
  formatCalendarRange,
  resolveSessionPlanningMode,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function PlanningPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const chapter = CA_ENGINEER_2026;
  const offers = chapter.jobOffers;

  const planningMode = session ? resolveSessionPlanningMode(session) : 'recurringPlan';

  const currentOffer = useMemo(() => {
    if (!session) return null;
    const offerId = session.selectedJobOfferId ?? chapter.defaultOfferId;
    return resolveJobOffer(chapter, offerId);
  }, [session, chapter]);

  useEffect(() => {
    if (!session) return;
    if (planningMode === 'interruptJobOffer') {
      setSelectedOfferId(chapter.counterfactualOfferId);
      return;
    }
    if (planningMode === 'initialPlan') {
      setSelectedOfferId(session.selectedJobOfferId ?? chapter.defaultOfferId);
    }
  }, [session, planningMode, chapter]);

  const selectedOffer =
    planningMode === 'interruptJobOffer' || planningMode === 'initialPlan'
      ? resolveJobOffer(chapter, selectedOfferId ?? chapter.defaultOfferId)
      : currentOffer;

  const effectiveMonthKey = session?.gameState.run.currentDate.slice(0, 7) ?? '2026-01';
  const planLabel = session?.currentAudit
    ? `Plan ${formatCalendarRange(session.currentAudit.asOf)}`
    : 'Plan next six months';

  const handleContinue = () => {
    if (!session) return;

    if (planningMode === 'interruptJobOffer' || planningMode === 'initialPlan') {
      if (!selectedOfferId) return;
      const withOffer = applyJobOfferToSession(session, selectedOfferId);
      const committed = commitCommandDraft(withOffer);
      setSession(committed);
      router.push('/play/decide');
      return;
    }

    const committed = commitCommandDraft({
      ...session,
      commandCapacityError: null,
    });
    setSession(committed);
    if (committed.commandCapacityError) return;
    router.push('/play/decide');
  };

  if (!ready || !session?.currentAudit) {
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
        <h2 className="mt-1 font-serif text-2xl text-ink">Set six-month policies</h2>
        <p className="mt-3 text-muted">
          Adjust persistent commands for the next chapter. Your current role stays fixed unless a
          job-offer interrupt fires mid-cycle.
        </p>
      </div>

      {currentOffer ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Current role</p>
          <p className="mt-1 font-semibold text-ink">
            {currentOffer.title} · {currentOffer.employer}
          </p>
          <p className="mt-1 text-muted">
            {formatMoney(currentOffer.baseSalaryAnnual)}/yr ·{' '}
            {currentOffer.remoteDaysPerWeek >= 5
              ? 'Remote'
              : `${currentOffer.remoteDaysPerWeek} WFH days · ${currentOffer.commuteMinutes} min commute`}{' '}
            · 401(k) deferral {(deferralRateFromOffer(currentOffer) * 100).toFixed(0)}%
          </p>
          {session.gameState.location.rentPaymentMonthly > 0 ? (
            <p className="mt-2 text-muted">
              Housing share: {formatMoney(session.gameState.location.rentPaymentMonthly)}/mo in{' '}
              {session.gameState.location.stateCode}
            </p>
          ) : null}
        </div>
      ) : null}

      <CommandCenter
        effectiveMonthKey={effectiveMonthKey}
        commands={session.commandDraft}
        capacityError={session.commandCapacityError}
        onChange={(commandDraft) => {
          const next = { ...session, commandDraft, commandCapacityError: null };
          savePlaySession(next);
          setSession(next);
        }}
      />

      <div className="flex justify-end border-t border-border pt-6">
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
