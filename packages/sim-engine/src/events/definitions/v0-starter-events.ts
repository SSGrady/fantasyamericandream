import type { EventDefinition } from '@fad/shared';

/** V0 starter events from docs/schema/event-schema.md */
export const V0_STARTER_EVENT_DEFINITIONS: EventDefinition[] = [
  {
    id: 'quiet_month',
    title: 'Quiet Month',
    category: 'quiet',
    baseProbabilityPerMonth: 0.35,
    severity: { distribution: 'fixed', outcomes: [{ id: 'none', weight: 1 }] },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'rent_increase',
    title: 'Rent Renewal Increase',
    category: 'housing',
    eligibility: { housingMode: 'rent' },
    baseProbabilityPerMonth: 0.04,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'mild', weight: 0.6, rentIncreasePct: 0.03 },
        { id: 'sharp', weight: 0.4, rentIncreasePct: 0.08 },
      ],
    },
    interruptsHalfYearPacing: false,
    calibration: { source: 'ZORI renewal bands', confidence: 'medium' },
  },
  {
    id: 'student_loan_grace_ends',
    title: 'Student Loan Grace Period Ends',
    category: 'taxes',
    baseProbabilityPerMonth: 0.02,
    severity: { distribution: 'fixed', outcomes: [{ id: 'payment_starts', weight: 1 }] },
    interruptsHalfYearPacing: true,
    calibration: { source: 'Federal loan grace schedule', confidence: 'high' },
  },
  {
    id: 'open_enrollment',
    title: 'Open Enrollment Window',
    category: 'insurance',
    baseProbabilityPerMonth: 0.015,
    severity: { distribution: 'fixed', outcomes: [{ id: 'annual', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'keep_plan', label: 'Keep current plan' },
      { id: 'switch_hdhp', label: 'Switch to HDHP for HSA', requiresLiteracy: ['workplace_benefits'] },
    ],
  },
  {
    id: '401k_match_available',
    title: '401(k) Employer Match Available',
    category: 'investing',
    eligibility: { employmentType: 'w2', minTenureMonths: 3 },
    baseProbabilityPerMonth: 0.01,
    severity: { distribution: 'fixed', outcomes: [{ id: 'match_eligible', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'increase_deferral', label: 'Increase deferral to capture match' },
      { id: 'defer_later', label: 'Defer decision', requiresLiteracy: ['workplace_benefits'] },
    ],
  },
  {
    id: 'delivery_habit_drain',
    title: 'Delivery Habit Drain',
    category: 'consumer',
    baseProbabilityPerMonth: 0.06,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'low', weight: 0.5 },
        { id: 'high', weight: 0.5 },
      ],
    },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'audit_spending', label: 'Audit delivery spending', requiresLiteracy: ['cash_flow_i'] },
      { id: 'ignore', label: 'Keep current habit' },
    ],
  },
  {
    id: 'layoff_warning',
    title: 'Layoff Rumors at Work',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 6 },
    baseProbabilityPerMonth: 0.012,
    modifiers: {
      macroRegime: { expansion: 0.7, mild_recession: 1.5, severe_recession: 2.2 },
    },
    severity: { distribution: 'fixed', outcomes: [{ id: 'warning', weight: 1 }] },
    interruptsHalfYearPacing: true,
    calibration: { source: 'BLS JOLTS layoff climate', confidence: 'medium' },
  },
  {
    id: 'layoff_executed',
    title: 'Layoff Executed',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 6 },
    baseProbabilityPerMonth: 0.008,
    modifiers: {
      macroRegime: { expansion: 0.8, mild_recession: 1.8, severe_recession: 2.5 },
      difficulty: { hard: 1.3 },
    },
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'mild', weight: 0.3, salaryResetPct: 0 },
        { id: 'severe', weight: 0.7, salaryResetPct: 0.15 },
      ],
    },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'negotiate_severance', label: 'Negotiate severance package' },
      { id: 'start_job_search', label: 'Begin aggressive job search' },
    ],
    cooldownMonths: 12,
    calibration: { source: 'BLS JOLTS layoffs rate 2026', confidence: 'medium' },
  },
  {
    id: 'job_offer',
    title: 'Job Offer Received',
    category: 'career',
    eligibility: { employmentType: 'w2' },
    baseProbabilityPerMonth: 0.015,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'lateral', weight: 0.4 },
        { id: 'raise', weight: 0.6, salaryResetPct: -0.1 },
      ],
    },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'accept', label: 'Accept offer' },
      { id: 'negotiate', label: 'Negotiate compensation' },
      { id: 'decline', label: 'Decline and stay' },
    ],
  },
  {
    id: 'ghost_job_loop',
    title: 'Ghost Job Application Loop',
    category: 'career',
    eligibility: { employmentType: 'unemployed' },
    baseProbabilityPerMonth: 0.08,
    severity: { distribution: 'fixed', outcomes: [{ id: 'time_sink', weight: 1 }] },
    interruptsHalfYearPacing: false,
    calibration: { source: 'Ghost job param 15-25%', confidence: 'low' },
  },
  {
    id: 'medical_er_visit',
    title: 'Emergency Room Visit',
    category: 'health',
    baseProbabilityPerMonth: 0.005,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'minor', weight: 0.7 },
        { id: 'major', weight: 0.3 },
      ],
    },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'review_eob', label: 'Review explanation of benefits', requiresLiteracy: ['insurance'] },
      { id: 'pay_minimum', label: 'Pay minimum due' },
    ],
  },
  {
    id: 'car_repair',
    title: 'Unexpected Car Repair',
    category: 'transportation',
    baseProbabilityPerMonth: 0.025,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'minor', weight: 0.65 },
        { id: 'major', weight: 0.35 },
      ],
    },
    interruptsHalfYearPacing: true,
  },
  {
    id: 'bonus_paid',
    title: 'Annual Bonus Paid',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 12 },
    baseProbabilityPerMonth: 0.02,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'modest', weight: 0.5, bonusPct: 0.05 },
        { id: 'strong', weight: 0.5, bonusPct: 0.15 },
      ],
    },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'market_drawdown_mild',
    title: 'Mild Market Drawdown',
    category: 'investing',
    baseProbabilityPerMonth: 0.04,
    modifiers: { macroRegime: { mild_recession: 2.0, severe_recession: 3.0 } },
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'mild', weight: 0.8, marketReturnShift: -0.05 },
        { id: 'moderate', weight: 0.2, marketReturnShift: -0.1 },
      ],
    },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'market_rally',
    title: 'Market Rally',
    category: 'investing',
    baseProbabilityPerMonth: 0.04,
    modifiers: { macroRegime: { expansion: 1.5 } },
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'mild', weight: 0.7, marketReturnShift: 0.04 },
        { id: 'strong', weight: 0.3, marketReturnShift: 0.08 },
      ],
    },
    interruptsHalfYearPacing: false,
  },
  {
    id: 'credit_limit_increase_offer',
    title: 'Credit Limit Increase Offer',
    category: 'consumer',
    baseProbabilityPerMonth: 0.03,
    severity: { distribution: 'fixed', outcomes: [{ id: 'offer', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'accept', label: 'Accept higher limit' },
      { id: 'decline', label: 'Decline offer', requiresLiteracy: ['credit_debt'] },
    ],
  },
  {
    id: 'subscription_creep',
    title: 'Subscription Creep Detected',
    category: 'consumer',
    baseProbabilityPerMonth: 0.05,
    severity: { distribution: 'fixed', outcomes: [{ id: 'creep', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'audit', label: 'Run subscription audit', requiresLiteracy: ['cash_flow_i'] },
      { id: 'ignore', label: 'Ignore for now' },
    ],
  },
  {
    id: 'roommate_opportunity',
    title: 'Roommate Cost-Split Opportunity',
    category: 'housing',
    eligibility: { housingMode: 'rent' },
    baseProbabilityPerMonth: 0.02,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'modest_savings', weight: 0.6, rentIncreasePct: -0.25 },
        { id: 'good_savings', weight: 0.4, rentIncreasePct: -0.35 },
      ],
    },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'explore', label: 'Explore roommate option' },
      { id: 'pass', label: 'Pass and keep solo lease' },
    ],
  },
  {
    id: 'certification_opportunity',
    title: 'Professional Certification Opportunity',
    category: 'education',
    baseProbabilityPerMonth: 0.015,
    severity: { distribution: 'fixed', outcomes: [{ id: 'course_offer', weight: 1 }] },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'enroll', label: 'Enroll and pay tuition' },
      { id: 'defer', label: 'Defer to next cycle' },
    ],
  },
  {
    id: 'promotion_review',
    title: 'Promotion Review Cycle',
    category: 'career',
    eligibility: { employmentType: 'w2', minTenureMonths: 12 },
    baseProbabilityPerMonth: 0.025,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'passed_over', weight: 0.4 },
        { id: 'promoted', weight: 0.6, salaryResetPct: -0.08 },
      ],
    },
    interruptsHalfYearPacing: true,
    choices: [
      { id: 'negotiate', label: 'Negotiate title and comp' },
      { id: 'accept', label: 'Accept outcome' },
    ],
  },
];

export const V0_STARTER_EVENT_IDS = V0_STARTER_EVENT_DEFINITIONS.map((event) => event.id);
