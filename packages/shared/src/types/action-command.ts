import { z } from 'zod';

export const COMMAND_SCHEMA_VERSION = 'command-v1';

export const JobSearchIntensitySchema = z.enum(['low', 'medium', 'aggressive']);
export type JobSearchIntensity = z.infer<typeof JobSearchIntensitySchema>;

export const RelocationIntentSchema = z.enum(['none', 'exploring', 'active']);
export type RelocationIntent = z.infer<typeof RelocationIntentSchema>;

export const DeliverySpendCapSchema = z.enum(['none', 'low', 'medium', 'high']);
export type DeliverySpendCap = z.infer<typeof DeliverySpendCapSchema>;

const baseCommand = {
  id: z.string().min(1),
  effectiveMonthKey: z.string().regex(/^\d{4}-\d{2}$/),
};

export const Set401kDeferralRateCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_401k_deferral_rate'),
  rate: z.number().min(0).max(0.25),
});

export const SetRothContributionMonthlyCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_roth_contribution_monthly'),
  amountCents: z.number().int().min(0),
});

export const SetHysaAutoTransferCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_hysa_auto_transfer'),
  amountCents: z.number().int().min(0),
});

export const SetBrokerageAutoTransferCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_brokerage_auto_transfer'),
  amountCents: z.number().int().min(0),
});

export const SetJobSearchIntensityCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_job_search_intensity'),
  intensity: JobSearchIntensitySchema,
});

export const SetDeliverySpendCapCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_delivery_spend_cap'),
  cap: DeliverySpendCapSchema,
});

export const RunSubscriptionAuditCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('run_subscription_audit'),
  enabled: z.boolean(),
});

export const SetSideGigHoursCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_side_gig_hours'),
  hoursPerWeek: z.number().min(0).max(20),
});

export const SetRelocationIntentCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_relocation_intent'),
  intent: RelocationIntentSchema,
});

export const SetEmergencyFundTargetCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_emergency_fund_target'),
  targetMonths: z.number().min(1).max(12),
});

export const SetStudentLoanExtraCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_student_loan_extra'),
  extraPaymentCents: z.number().int().min(0),
});

export const SetCreditCardPaydownCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_credit_card_paydown'),
  extraPaymentCents: z.number().int().min(0),
});

export const SetCookingCommitmentCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_cooking_commitment'),
  cookingSkill: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const SetCoastModeCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_coast_mode'),
  enabled: z.boolean(),
});

export const SetCareerUpskillHoursCommandSchema = z.object({
  ...baseCommand,
  type: z.literal('set_career_upskill_hours'),
  hoursPerWeek: z.number().min(0).max(10),
});

export const ActionCommandSchema = z.discriminatedUnion('type', [
  Set401kDeferralRateCommandSchema,
  SetRothContributionMonthlyCommandSchema,
  SetHysaAutoTransferCommandSchema,
  SetBrokerageAutoTransferCommandSchema,
  SetJobSearchIntensityCommandSchema,
  SetDeliverySpendCapCommandSchema,
  RunSubscriptionAuditCommandSchema,
  SetSideGigHoursCommandSchema,
  SetRelocationIntentCommandSchema,
  SetEmergencyFundTargetCommandSchema,
  SetStudentLoanExtraCommandSchema,
  SetCreditCardPaydownCommandSchema,
  SetCookingCommitmentCommandSchema,
  SetCoastModeCommandSchema,
  SetCareerUpskillHoursCommandSchema,
]);

export type ActionCommand = z.infer<typeof ActionCommandSchema>;

export type ActionCommandType = ActionCommand['type'];

export const ACTION_COMMAND_TYPES = ActionCommandSchema.options.map(
  (schema) => schema.shape.type.value,
) as ActionCommandType[];

export interface CommandState {
  schemaVersion: string;
  activeCommands: ActionCommand[];
  weeklyCapacityHours: number;
}

export const DEFAULT_WEEKLY_CAPACITY_HOURS = 14;

export const DEFAULT_COMMAND_STATE: CommandState = {
  schemaVersion: COMMAND_SCHEMA_VERSION,
  activeCommands: [],
  weeklyCapacityHours: DEFAULT_WEEKLY_CAPACITY_HOURS,
};

/** Weekly capacity cost per command type (hours). Zero = passive finance knob. */
export const COMMAND_CAPACITY_HOURS: Record<ActionCommandType, number> = {
  set_401k_deferral_rate: 0,
  set_roth_contribution_monthly: 0,
  set_hysa_auto_transfer: 0,
  set_brokerage_auto_transfer: 0,
  set_job_search_intensity: 0,
  set_delivery_spend_cap: 0,
  run_subscription_audit: 1,
  set_side_gig_hours: 0,
  set_relocation_intent: 0,
  set_emergency_fund_target: 0,
  set_student_loan_extra: 0,
  set_credit_card_paydown: 0,
  set_cooking_commitment: 1,
  set_coast_mode: 0,
  set_career_upskill_hours: 0,
};

function intensityHours(intensity: JobSearchIntensity): number {
  if (intensity === 'low') return 2;
  if (intensity === 'medium') return 5;
  return 8;
}

/** Parse range input values defensively (guards against non-numeric or Event-like values). */
export function parseSliderNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatCentsMonthly(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `$${dollars.toLocaleString('en-US')}/mo`;
}

/** Human-readable policy value for plan summaries (never hours for passive money knobs). */
export function formatCommandPolicySummary(command: ActionCommand): string {
  switch (command.type) {
    case 'set_401k_deferral_rate':
      return `${Math.round(parseSliderNumber(command.rate, 0) * 100)}%`;
    case 'set_roth_contribution_monthly':
    case 'set_hysa_auto_transfer':
    case 'set_brokerage_auto_transfer':
      return formatCentsMonthly(parseSliderNumber(command.amountCents, 0));
    case 'set_student_loan_extra':
    case 'set_credit_card_paydown':
      return formatCentsMonthly(parseSliderNumber(command.extraPaymentCents, 0));
    case 'set_job_search_intensity':
      return `${intensityHours(command.intensity)}h/wk`;
    case 'set_side_gig_hours':
    case 'set_career_upskill_hours':
      return `${parseSliderNumber(command.hoursPerWeek, 0)}h/wk`;
    case 'set_delivery_spend_cap':
      return command.cap;
    case 'set_relocation_intent':
      return command.intent === 'none'
        ? 'none'
        : `${command.intent} · ${commandWeeklyCapacityHours(command)}h/wk`;
    case 'run_subscription_audit':
      return command.enabled ? '1h/wk audit' : 'Off';
    case 'set_emergency_fund_target':
      return `${command.targetMonths} mo target`;
    case 'set_cooking_commitment':
      return `skill ${command.cookingSkill}`;
    case 'set_coast_mode':
      return command.enabled ? 'On' : 'Off';
    default:
      return '';
  }
}

/** Capacity badge for catalog tiles; null when the command has no weekly time cost. */
export function formatCommandCapacityBadge(command: ActionCommand): string | null {
  const hours = commandWeeklyCapacityHours(command);
  if (hours <= 0) return null;
  return `${hours}h/wk`;
}

export function commandWeeklyCapacityHours(command: ActionCommand): number {
  if (command.type === 'set_job_search_intensity') {
    return intensityHours(command.intensity);
  }
  if (command.type === 'set_side_gig_hours') {
    return command.hoursPerWeek;
  }
  if (command.type === 'set_relocation_intent') {
    if (command.intent === 'exploring') return 2;
    if (command.intent === 'active') return 6;
    return 0;
  }
  if (command.type === 'set_career_upskill_hours') {
    return command.hoursPerWeek;
  }
  return COMMAND_CAPACITY_HOURS[command.type];
}

export function totalWeeklyCapacityUsed(commands: ActionCommand[]): number {
  const byType = new Map<ActionCommandType, ActionCommand>();
  for (const command of commands) {
    byType.set(command.type, command);
  }
  let total = 0;
  for (const command of byType.values()) {
    total += commandWeeklyCapacityHours(command);
  }
  return total;
}

export function validateCommandCapacity(input: {
  commands: ActionCommand[];
  weeklyCapacityHours: number;
}): { ok: true } | { ok: false; used: number; limit: number } {
  const used = totalWeeklyCapacityUsed(input.commands);
  if (used > input.weeklyCapacityHours) {
    return { ok: false, used, limit: input.weeklyCapacityHours };
  }
  return { ok: true };
}

export function parseActionCommandsJson(json: unknown): ActionCommand[] {
  return z.array(ActionCommandSchema).parse(json);
}

export function parseActionCommandJson(json: unknown): ActionCommand {
  return ActionCommandSchema.parse(json);
}

/** Last command wins per type (deterministic mid-chapter replace). */
export function normalizeActiveCommands(commands: ActionCommand[]): ActionCommand[] {
  const byType = new Map<ActionCommandType, ActionCommand>();
  for (const command of commands) {
    byType.set(command.type, command);
  }
  return [...byType.values()].sort((a, b) => a.type.localeCompare(b.type));
}

export interface ResolvedCommandEffects {
  deferral401kRate?: number;
  rothContributionMonthlyCents: number;
  hysaTransferMonthlyCents: number;
  brokerageTransferMonthlyCents: number;
  studentLoanExtraCents: number;
  creditCardExtraCents: number;
  deliveryFrequency?: PlayerDeliveryFrequency;
  cookingSkill?: 0 | 1 | 2 | 3;
  subscriptionAudit: boolean;
  sideGigHoursPerWeek: number;
  jobSearchIntensity: JobSearchIntensity;
  relocationIntent: RelocationIntent;
  coastMode: boolean;
  upskillHoursPerWeek: number;
}

export type PlayerDeliveryFrequency = 'none' | 'low' | 'medium' | 'high';

export function resolveCommandEffects(commands: ActionCommand[]): ResolvedCommandEffects {
  const active = normalizeActiveCommands(commands);
  const effects: ResolvedCommandEffects = {
    rothContributionMonthlyCents: 0,
    hysaTransferMonthlyCents: 0,
    brokerageTransferMonthlyCents: 0,
    studentLoanExtraCents: 0,
    creditCardExtraCents: 0,
    subscriptionAudit: false,
    sideGigHoursPerWeek: 0,
    jobSearchIntensity: 'low',
    relocationIntent: 'none',
    coastMode: false,
    upskillHoursPerWeek: 0,
  };

  for (const command of active) {
    switch (command.type) {
      case 'set_401k_deferral_rate':
        effects.deferral401kRate = command.rate;
        break;
      case 'set_roth_contribution_monthly':
        effects.rothContributionMonthlyCents = command.amountCents;
        break;
      case 'set_hysa_auto_transfer':
        effects.hysaTransferMonthlyCents = command.amountCents;
        break;
      case 'set_brokerage_auto_transfer':
        effects.brokerageTransferMonthlyCents = command.amountCents;
        break;
      case 'set_job_search_intensity':
        effects.jobSearchIntensity = command.intensity;
        break;
      case 'set_delivery_spend_cap':
        effects.deliveryFrequency = command.cap;
        break;
      case 'run_subscription_audit':
        effects.subscriptionAudit = command.enabled;
        break;
      case 'set_side_gig_hours':
        effects.sideGigHoursPerWeek = command.hoursPerWeek;
        break;
      case 'set_relocation_intent':
        effects.relocationIntent = command.intent;
        break;
      case 'set_emergency_fund_target':
        effects.hysaTransferMonthlyCents = Math.max(
          effects.hysaTransferMonthlyCents,
          command.targetMonths * 100_00,
        );
        break;
      case 'set_student_loan_extra':
        effects.studentLoanExtraCents = command.extraPaymentCents;
        break;
      case 'set_credit_card_paydown':
        effects.creditCardExtraCents = command.extraPaymentCents;
        break;
      case 'set_cooking_commitment':
        effects.cookingSkill = command.cookingSkill;
        break;
      case 'set_coast_mode':
        effects.coastMode = command.enabled;
        break;
      case 'set_career_upskill_hours':
        effects.upskillHoursPerWeek = command.hoursPerWeek;
        break;
      default:
        break;
    }
  }

  return effects;
}
