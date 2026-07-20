import type { EventDefinition } from '@fad/shared';

/** V1 expansion events (beyond 20 V0 starters). */
export const V1_EXPANSION_EVENT_DEFINITIONS: EventDefinition[] = [
  {
    id: 'return_to_office_mandate',
    title: 'Return-to-Office Mandate',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 3 },
    baseProbabilityPerMonth: 0.02,
    severity: { distribution: 'fixed', outcomes: [{ id: 'commute_cost', weight: 1 }] },
    interruptsHalfYearPacing: false,
    calibration: { source: 'Hybrid RTO surveys 2024-2026', confidence: 'medium' },
  },
  {
    id: 'rent_surge',
    title: 'Rent Surge at Renewal',
    category: 'housing',
    eligibility: { housingMode: 'rent' },
    baseProbabilityPerMonth: 0.035,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'zori_band', weight: 0.7, rentIncreasePct: 0.05 },
        { id: 'sharp_surge', weight: 0.3, rentIncreasePct: 0.12 },
      ],
    },
    interruptsHalfYearPacing: true,
    calibration: { source: 'ZORI-style renewal bands', confidence: 'medium' },
  },
  {
    id: 'wedding_invitation',
    title: 'Friend Wedding Invitation',
    category: 'family',
    baseProbabilityPerMonth: 0.018,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'local', weight: 0.5 },
        { id: 'destination', weight: 0.5 },
      ],
    },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'attend', label: 'Attend and budget travel' },
      { id: 'decline', label: 'Decline politely' },
    ],
  },
  {
    id: 'side_gig_opportunity',
    title: 'Side Gig Opportunity',
    category: 'opportunity',
    eligibility: { employmentType: 'w2' },
    baseProbabilityPerMonth: 0.025,
    severity: { distribution: 'fixed', outcomes: [{ id: 'offer', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'accept', label: 'Take on limited hours' },
      { id: 'decline', label: 'Focus on primary job' },
    ],
  },
  {
    id: 'tax_refund_arrives',
    title: 'Tax Refund Arrives',
    category: 'taxes',
    baseProbabilityPerMonth: 0.012,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'modest', weight: 0.6, bonusPct: 0.02 },
        { id: 'large', weight: 0.4, bonusPct: 0.05 },
      ],
    },
    interruptsHalfYearPacing: false,
    calibration: { source: 'IRS average refund bands', confidence: 'medium' },
  },
  {
    id: 'grocery_inflation_shock',
    title: 'Grocery Bill Inflation Shock',
    category: 'consumer',
    baseProbabilityPerMonth: 0.04,
    modifiers: { macroRegime: { inflation_shock: 2.0, mild_recession: 1.3 } },
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'mild', weight: 0.7 },
        { id: 'sharp', weight: 0.3 },
      ],
    },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'auto_insurance_renewal',
    title: 'Auto Insurance Renewal Increase',
    category: 'transportation',
    baseProbabilityPerMonth: 0.03,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'small_hike', weight: 0.6 },
        { id: 'large_hike', weight: 0.4 },
      ],
    },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'shop_rates', label: 'Shop competing quotes', requiresLiteracy: ['transportation'] },
      { id: 'accept', label: 'Accept renewal' },
    ],
  },
  {
    id: 'passed_over_for_raise',
    title: 'Passed Over for Raise',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 12 },
    baseProbabilityPerMonth: 0.02,
    severity: { distribution: 'fixed', outcomes: [{ id: 'no_raise', weight: 1 }] },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'negotiate', label: 'Request compensation review' },
      { id: 'job_search', label: 'Start external search' },
    ],
  },
  {
    id: 'burnout_warning',
    title: 'Burnout Warning Signs',
    category: 'health',
    eligibility: { employmentType: 'w2', minTenureMonths: 6 },
    baseProbabilityPerMonth: 0.015,
    severity: { distribution: 'fixed', outcomes: [{ id: 'fatigue', weight: 1 }] },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'take_pto', label: 'Use PTO and reset' },
      { id: 'push_through', label: 'Push through this cycle' },
    ],
  },
  {
    id: 'mortgage_rate_spike',
    title: 'Mortgage Rate Spike Headline',
    category: 'investing',
    baseProbabilityPerMonth: 0.02,
    modifiers: { macroRegime: { inflation_shock: 1.8, severe_recession: 1.5 } },
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'headline', weight: 0.8, marketReturnShift: -0.02 },
        { id: 'sharp', weight: 0.2, marketReturnShift: -0.04 },
      ],
    },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'roommate_moves_out',
    title: 'Roommate Moves Out',
    category: 'housing',
    eligibility: { housingMode: 'rent' },
    baseProbabilityPerMonth: 0.015,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'partial_rent', weight: 0.5, rentIncreasePct: 0.5 },
        { id: 'full_rent', weight: 0.5, rentIncreasePct: 1.0 },
      ],
    },
    interruptsHalfYearPacing: true,
  },
  {
    id: 'phishing_scam_attempt',
    title: 'Phishing Scam Attempt',
    category: 'fraud',
    baseProbabilityPerMonth: 0.022,
    severity: { distribution: 'fixed', outcomes: [{ id: 'attempt', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'report', label: 'Report and freeze cards', requiresLiteracy: ['taxes'] },
      { id: 'ignore', label: 'Delete and move on' },
    ],
    calibration: { source: 'FTC fraud reports', confidence: 'low' },
  },
  {
    id: 'parental_leave_stub',
    title: 'Parental Leave Planning',
    category: 'children',
    eligibility: { employmentType: 'w2', minTenureMonths: 6 },
    baseProbabilityPerMonth: 0.005,
    severity: { distribution: 'fixed', outcomes: [{ id: 'planning', weight: 1 }] },
    interruptsHalfYearPacing: false,
    cooldownMonths: 24,
    calibration: { source: 'FMLA unpaid leave stub', confidence: 'low' },
  },
];

export const V1_EXPANSION_EVENT_IDS = V1_EXPANSION_EVENT_DEFINITIONS.map((event) => event.id);
