import type { AuditSnapshot } from '@fad/shared';

export type StakeholderId = 'partner' | 'future_you_35' | 'recruiter' | 'fee_planner';

export type ReactionSentiment =
  | 'Supportive'
  | 'Cautiously optimistic'
  | 'Neutral'
  | 'Mixed'
  | 'Concerned';

export interface StakeholderReaction {
  id: StakeholderId;
  name: string;
  sentiment: ReactionSentiment;
  note: string;
}

export interface ReactionContext {
  housingBurdenPct?: number;
  playerName?: string;
  /** When true, partner voice is included. Defaults to false for single households. */
  includePartner?: boolean;
}

function savingsSentiment(rate: number): ReactionSentiment {
  if (rate >= 0.2) return 'Supportive';
  if (rate >= 0.1) return 'Cautiously optimistic';
  if (rate >= 0.05) return 'Mixed';
  return 'Concerned';
}

function runwayNote(months: number): string {
  if (!Number.isFinite(months) || months >= 6) {
    return 'Your cash buffer could absorb a short job search without panic.';
  }
  if (months >= 3) {
    return 'Runway is workable, but one surprise bill would tighten things fast.';
  }
  return 'Runway looks thin. A missed paycheck would force hard tradeoffs.';
}

export function renderPartnerReaction(
  audit: AuditSnapshot,
  context: ReactionContext,
): StakeholderReaction {
  const burden = context.housingBurdenPct ?? 0.3;
  let sentiment: ReactionSentiment = savingsSentiment(audit.savingsRate);
  let note: string;

  if (burden > 0.35) {
    sentiment = 'Concerned';
    note = `Rent is eating ${(burden * 100).toFixed(0)}% of take-home. We need a plan before the next lease cycle.`;
  } else if (audit.netWorthDelta >= 0) {
    note = `Net worth moved in the right direction. ${runwayNote(audit.emergencyRunwayMonths)}`;
  } else {
    sentiment = 'Mixed';
    note = `This period set us back $${(Math.abs(audit.netWorthDelta) / 100).toFixed(0)}. Let's talk about what we cut next.`;
  }

  return { id: 'partner', name: 'Partner', sentiment, note };
}

export function renderFutureYouReaction(audit: AuditSnapshot): StakeholderReaction {
  const sentiment = savingsSentiment(audit.savingsRate);
  const contrib = audit.contributionProgress.traditional401k;
  const contribNote =
    contrib && contrib.pctOfLimit > 0
      ? `401(k) is ${(contrib.pctOfLimit * 100).toFixed(0)}% toward the annual cap.`
      : 'Tax-advantaged room is still on the table.';

  const note =
    audit.netWorthDelta >= 0
      ? `${contribNote} Keep compounding; small raises add up by 35.`
      : `${contribNote} One soft period is fine, but two in a row makes 35 harder.`;

  return { id: 'future_you_35', name: 'Future You (35)', sentiment, note };
}

export function renderRecruiterReaction(audit: AuditSnapshot): StakeholderReaction {
  const sentiment: ReactionSentiment =
    audit.netWorthDelta >= 0 ? 'Neutral' : 'Cautiously optimistic';
  const note =
    audit.savingsRate >= 0.15
      ? 'Your profile still reads stable. We can talk when you are ready, not when you are desperate.'
      : 'Hiring cooled in your sector. Staying employed matters more than chasing a 10% raise right now.';

  return { id: 'recruiter', name: 'Recruiter', sentiment, note };
}

export function renderFeePlannerReaction(audit: AuditSnapshot): StakeholderReaction {
  const sentiment: ReactionSentiment =
    audit.emergencyRunwayMonths < 3 ? 'Concerned' : savingsSentiment(audit.savingsRate);
  const roth = audit.contributionProgress.rothIra;
  const rothNote = roth
    ? `Roth room: ${(roth.pctOfLimit * 100).toFixed(0)}% used. `
    : '';

  const note = `${rothNote}${runwayNote(audit.emergencyRunwayMonths)} Fees matter less than the savings rate you actually sustain.`;

  return { id: 'fee_planner', name: 'Fee-only planner', sentiment, note };
}

export function renderStakeholderReactions(
  audit: AuditSnapshot,
  context: ReactionContext = {},
): StakeholderReaction[] {
  const includePartner = context.includePartner ?? false;

  if (includePartner) {
    return [
      renderPartnerReaction(audit, context),
      renderFutureYouReaction(audit),
      renderRecruiterReaction(audit),
      renderFeePlannerReaction(audit),
    ];
  }

  return [
    renderFutureYouReaction(audit),
    renderRecruiterReaction(audit),
    renderFeePlannerReaction(audit),
  ];
}
