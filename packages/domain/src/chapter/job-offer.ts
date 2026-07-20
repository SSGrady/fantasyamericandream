import type { ChapterDefinition, JobOffer } from './types.js';

export interface JobOfferOverrides {
  employer?: string;
  title?: string;
  baseSalaryAnnual?: number;
  commuteMinutes?: number;
  remoteDaysPerWeek?: number;
  deferral401kMatchPct?: number;
}

/** Resolve a preset or custom job offer from chapter content. */
export function resolveJobOffer(
  chapter: ChapterDefinition,
  offerId: string,
  overrides?: JobOfferOverrides,
): JobOffer {
  if (offerId === 'custom') {
    const preset = chapter.jobOffers.find((o) => o.id === chapter.defaultOfferId) ?? chapter.jobOffers[0]!;
    return {
      ...preset,
      id: 'custom',
      employer: overrides?.employer?.trim() || 'Custom employer',
      title: overrides?.title?.trim() || preset.title,
      baseSalaryAnnual: overrides?.baseSalaryAnnual ?? preset.baseSalaryAnnual,
      commuteMinutes: overrides?.commuteMinutes ?? preset.commuteMinutes,
      remoteDaysPerWeek: overrides?.remoteDaysPerWeek ?? preset.remoteDaysPerWeek,
      deferral401kMatchPct: overrides?.deferral401kMatchPct ?? preset.deferral401kMatchPct,
      flavor: 'Custom offer terms you negotiated.',
      riskTag: preset.riskTag,
    };
  }

  const preset = chapter.jobOffers.find((o) => o.id === offerId);
  if (!preset) {
    return chapter.jobOffers.find((o) => o.id === chapter.defaultOfferId) ?? chapter.jobOffers[0]!;
  }
  return preset;
}

/** Default 401(k) deferral from offer match band. */
export function deferralRateFromOffer(offer: JobOffer): number {
  return Math.min(0.1, offer.deferral401kMatchPct + 0.06);
}
