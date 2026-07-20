'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { comparePoliciesWithCrn } from '@fad/monte-carlo';
import { CA_ENGINEER_2026 } from '@fad/domain';
import { formatMoney } from '../../../lib/format-money';
import { usePlaySession } from '../../../lib/use-play-session';

export function CounterfactualPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();

  const chapter = CA_ENGINEER_2026;
  const chosenOffer = useMemo(
    () =>
      chapter.jobOffers.find((o) => o.title === session?.gameState.career.title) ??
      chapter.jobOffers[0],
    [session, chapter.jobOffers],
  );
  const altOffer =
    chapter.jobOffers.find((o) => o.id === chapter.counterfactualOfferId) ?? chapter.jobOffers[2]!;

  const branchComparison = useMemo(() => {
    if (!session?.currentAudit || !chosenOffer) return null;

    const audit = session.currentAudit;
    const salaryRatio = altOffer.baseSalaryAnnual / Math.max(chosenOffer.baseSalaryAnnual, 1);
    const monthlyNetPay = audit.periodNetPayCents / 6;
    const altMonthlyNetPay = Math.round(monthlyNetPay * salaryRatio);
    const monthlySavings = Math.round(audit.savingsRate * monthlyNetPay);
    const altMonthlySavings = Math.round(audit.savingsRate * altMonthlyNetPay);
    const monthlyBurn = Math.max(monthlyNetPay - monthlySavings, 1);

    return comparePoliciesWithCrn({
      seed: `${session.gameState.run.randomSeed}:counterfactual`,
      horizonMonths: 6,
      paths: 200,
      baselineSnapshot: {
        netWorth: audit.netWorth,
        monthlySavingsCents: monthlySavings,
        monthlyBurnCents: monthlyBurn,
      },
      policySnapshot: {
        netWorth: audit.netWorth,
        monthlySavingsCents: altMonthlySavings,
        monthlyBurnCents: Math.max(altMonthlyNetPay - altMonthlySavings, 1),
      },
    });
  }, [session, chosenOffer, altOffer]);

  if (!ready || !session?.currentAudit || !chosenOffer) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading counterfactual…
      </div>
    );
  }

  const audit = session.currentAudit;
  const salaryDelta = chosenOffer.baseSalaryAnnual - altOffer.baseSalaryAnnual;
  const altRunway =
    branchComparison && branchComparison.policyMedianFinal > 0
      ? audit.emergencyRunwayMonths +
        (branchComparison.deltaMedianFinal / Math.max(audit.periodNetPayCents / 6, 1)) * 0.02
      : audit.emergencyRunwayMonths;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Counterfactual</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">What if you picked differently?</h2>
        <p className="mt-3 text-muted">
          CRN branch comparison on the same macro seed: your chosen offer vs the alternate path.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Your path</p>
          <p className="mt-1 text-lg font-semibold text-ink">{chosenOffer.employer}</p>
          <p className="text-sm text-muted">{formatMoney(chosenOffer.baseSalaryAnnual)}/yr</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Net worth</dt>
              <dd className="font-medium text-ink">{formatMoney(audit.netWorth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Runway</dt>
              <dd className="font-medium text-ink">{audit.emergencyRunwayMonths.toFixed(1)} mo</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Alternate offer</p>
          <p className="mt-1 text-lg font-semibold text-ink">{altOffer.employer}</p>
          <p className="text-sm text-muted">{formatMoney(altOffer.baseSalaryAnnual)}/yr</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Salary delta</dt>
              <dd className="font-medium text-ink">{formatMoney(salaryDelta, { signed: true })}</dd>
            </div>
            {branchComparison ? (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted">6-mo NW delta (CRN)</dt>
                  <dd className="font-medium text-ink">
                    {formatMoney(branchComparison.deltaMedianFinal, { signed: true })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Est. runway shift</dt>
                  <dd className="font-medium text-ink">{altRunway.toFixed(1)} mo</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Decision vs luck split</dt>
                  <dd className="font-medium text-ink">
                    {formatMoney(branchComparison.decisionCents, { signed: true })} /{' '}
                    {formatMoney(branchComparison.luckCents, { signed: true })}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.push('/play/audit')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to audit
        </button>
      </div>
    </div>
  );
}
