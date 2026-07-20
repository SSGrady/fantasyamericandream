export { renderBriefingHeadline, renderBriefingEventsSummary } from './briefing.js';
export { renderEditorialHeadline, renderConsequenceSummary } from './templates/briefing-templates.js';
export { renderTemplate } from './templates/engine.js';
export { adaptBriefingNarrative } from './llm/adapter.js';
export { interpretNaturalLanguageAction } from './llm/action-interpretation.js';
export { parseLlmNarrative, parseLlmActionInterpretation } from './llm/schemas.js';
export {
  renderFeePlannerReaction,
  renderFutureYouReaction,
  renderPartnerReaction,
  renderRecruiterReaction,
  renderStakeholderReactions,
  type ReactionContext,
  type ReactionSentiment,
  type StakeholderId,
  type StakeholderReaction,
} from './reactions.js';
export {
  renderDemoLimitCopy,
  renderEndReportCopy,
  type EndReportCopy,
} from './end-report.js';
