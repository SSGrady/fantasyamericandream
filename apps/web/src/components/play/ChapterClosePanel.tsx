'use client';

import type { ChapterCloseTab, RunState } from '@fad/domain';
import {
  renderConsequenceSummary,
  renderEditorialHeadline,
  renderStakeholderReactions,
} from '@fad/narrative';
import { comparePoliciesWithCrn } from '@fad/monte-carlo';
import { CA_ENGINEER_2026, resolveJobOffer, selectContributionProgress, selectRibbonMetrics } from '@fad/domain';
import { useMemo } from 'react';
import { BalanceSheetGrid } from './BalanceSheetGrid';
import { ConsequenceCard } from './ConsequenceCard';
import { ImpactAnalysisCards } from './ImpactAnalysisCards';
import { MonthTimeline, chapterMonthsFromAsOf } from './MonthTimeline';
import { ProgressRings } from './ProgressRings';
import { WaterfallList } from './WaterfallList';
import { formatMoney, formatPercent } from '../../lib/format-money';
import { computeMetricBreakdown, hasUnlockedSkill } from '../../lib/play-session';

const TABS: { id: ChapterCloseTab; label: string }[] = [
  { id: 'story', label: 'Story' },
  { id: 'money', label: 'Money' },
  { id: 'whatIf', label: 'What If?' },
  { id: 'voices', label: 'Voices' },
  { id: 'lesson', label: 'Lesson' },
];

interface ChapterClosePanelProps {
  session: RunState;
  activeTab: ChapterCloseTab;
  onTabChange: (tab: ChapterCloseTab) => void;
  onContinue?: () => void;
}

export function ChapterClosePanel({
  session,
  activeTab,
  onTabChange,
  onContinue,
}: ChapterClosePanelProps) {
  const audit = session.currentAudit;
  const preview = session.impactPreview;
  const chosenAudit = preview?.chosenAudit ?? audit;

  const chapter = CA_ENGINEER_2026;
  const chosenOffer = resolveJobOffer(chapter, session.acceptedOfferId);
  const altOffer =
    chapter.jobOffers.find((o) => o.id === chapter.counterfactualOfferId) ?? chapter.jobOffers[2]!;

  const branchComparison = useMemo(() => {
    if (!audit) return null;
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
  }, [session, audit, chosenOffer, altOffer]);

  if (!audit || !chosenAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Chapter close unlocks after simulation completes.
      </div>
    );
  }

  const metrics = selectRibbonMetrics(session);
  const breakdown = computeMetricBreakdown(chosenAudit, session.gameState);
  const contributionProgress = selectContributionProgress(session);
  const reactions = renderStakeholderReactions(audit, {
    housingBurdenPct: metrics.housingBurdenPct,
    playerName: session.gameState.player.name,
    includePartner:
      session.gameState.household.maritalStatus !== 'single' &&
      session.gameState.household.partner !== undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'bg-surface text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'story' ? (
        <div className="space-y-4 phase-enter">
          <ConsequenceCard
            variant="headline"
            title="Chapter close"
            body={renderConsequenceSummary(chosenAudit)}
            audit={chosenAudit}
            sentiment={preview && preview.deltaNetWorth >= 0 ? 'positive' : 'neutral'}
          />
          <p className="font-display text-xl text-ink">
            {renderEditorialHeadline(chosenAudit, session.gameState.player.name)}
          </p>
          <MonthTimeline months={chapterMonthsFromAsOf(audit.asOf)} activeIndex={5} />
          {preview ? (
            <p className="text-sm text-muted">
              Net worth {formatMoney(preview.deltaNetWorth, { signed: true })} vs baseline · Savings{' '}
              {formatPercent(preview.deltaSavingsRate, { signed: true })}
            </p>
          ) : null}
        </div>
      ) : null}

      {activeTab === 'money' ? (
        <div className="space-y-6 phase-enter">
          <ImpactAnalysisCards
            audit={chosenAudit}
            breakdown={breakdown}
            housingBurdenPct={metrics.housingBurdenPct}
            rothIra={session.gameState.accounts.rothIra}
            startingRothBalance={session.startingRothBalance}
            emphasizeSavingsRate={hasUnlockedSkill(session, 'investing_i')}
          />
          <BalanceSheetGrid accounts={session.gameState.accounts} debts={session.gameState.debts} />
          <WaterfallList lines={audit.waterfall} />
          <ProgressRings
            progress={contributionProgress}
            rothIra={session.gameState.accounts.rothIra}
            startingRothBalance={session.startingRothBalance}
            rothMarketReturnsCents={audit.accountInvestmentReturns?.rothIra ?? 0}
          />
        </div>
      ) : null}

      {activeTab === 'whatIf' ? (
        <div className="grid gap-4 sm:grid-cols-2 phase-enter">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Your path</p>
            <p className="mt-1 text-lg font-semibold text-ink">{chosenOffer.employer}</p>
            <p className="text-sm text-muted">{formatMoney(chosenOffer.baseSalaryAnnual)}/yr</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Alternate</p>
            <p className="mt-1 text-lg font-semibold text-ink">{altOffer.employer}</p>
            <p className="text-sm text-muted">{formatMoney(altOffer.baseSalaryAnnual)}/yr</p>
            {branchComparison ? (
              <p className="mt-3 text-sm text-muted">
                6-mo NW delta (CRN):{' '}
                {formatMoney(branchComparison.deltaMedianFinal, { signed: true })}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === 'voices' ? (
        <div className="space-y-3 phase-enter">
          {reactions.map((persona) => (
            <div key={persona.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-ink">{persona.name}</h3>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                  {persona.sentiment}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{persona.note}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === 'lesson' ? (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm phase-enter">
          {session.chapterLessonUnlock ? (
            <>
              <p className="text-sm font-medium text-positive">Lesson unlocked</p>
              <p className="mt-2 text-muted">
                {session.chapterLessonUnlock.replace('_', ' ')} literacy track is now available.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">
              Complete the chapter audit with thin runway or positive savings to unlock a literacy
              lesson.
            </p>
          )}
        </div>
      ) : null}

      {onContinue ? (
        <div className="flex justify-end border-t border-border pt-6">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            Continue to dashboard
          </button>
        </div>
      ) : null}
    </div>
  );
}
