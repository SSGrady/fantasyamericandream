import { describe, expect, it } from 'vitest';
import type { AuditSnapshot } from '@fad/shared';
import { renderEditorialHeadline } from '../templates/briefing-templates.js';
import { renderTemplate } from '../templates/engine.js';

const fixtureAudit: AuditSnapshot = {
  asOf: '2026-06-30',
  startNetWorth: 10_000_00,
  netWorth: 12_500_00,
  netWorthDelta: 2_500_00,
  waterfall: [],
  periodNetPayCents: 15_000_00,
  savingsRate: 0.12,
  deferral401kRate: 0.06,
  cashSurplusRate: 0.06,
  emergencyRunwayMonths: 4.5,
  contributionProgress: {},
};

describe('narrative templates', () => {
  it('renders handlebars-style tokens', () => {
    expect(renderTemplate('Hello {{name}}', { name: 'Alex' })).toBe('Hello Alex');
    expect(renderTemplate('{{x}}', { x: 42 })).toBe('42');
  });

  it('renders editorial headline from audit fixture', () => {
    const headline = renderEditorialHeadline(fixtureAudit, 'Alex');
    expect(headline).toContain('Alex');
    expect(headline).toContain('2500');
  });
});
