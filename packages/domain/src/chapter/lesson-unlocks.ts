import type { AuditSnapshot, LiteracySkillId } from '@fad/shared';
import type { ChapterDefinition } from './types.js';

export interface LessonUnlockResult {
  skillId: LiteracySkillId;
  reason: string;
}

export function evaluateChapterLessonUnlock(
  chapter: ChapterDefinition,
  audit: AuditSnapshot,
): LessonUnlockResult | null {
  if (chapter.lessonUnlockCondition === 'thin_runway' && audit.emergencyRunwayMonths < 3) {
    return {
      skillId: chapter.lessonUnlockSkillId,
      reason: 'Runway dropped below three months. Emergency fund literacy unlocks.',
    };
  }
  if (chapter.lessonUnlockCondition === 'positive_savings' && audit.savingsRate >= 0.1) {
    return {
      skillId: chapter.lessonUnlockSkillId,
      reason: 'Double-digit savings rate sustained. Investing literacy unlocks.',
    };
  }
  return null;
}
