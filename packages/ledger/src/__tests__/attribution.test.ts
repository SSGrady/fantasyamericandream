import { describe, expect, it } from 'vitest';
import { buildNetWorthAttribution, tickSixMonths } from '../index.js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SixMonthTickInput } from '../audit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('net worth attribution', () => {
  it('reconciles attribution to net worth delta within rounding', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as { input: SixMonthTickInput };

    const result = tickSixMonths(fixture.input);
    const attribution = result.audit.attribution!;

    expect(attribution.contributionCents).toBeGreaterThan(0);
    const attributed =
      attribution.choiceCents +
      attribution.luckCents -
      attribution.lifestyleLeakageCents +
      attribution.residualCents;
    expect(Math.abs(attributed - result.audit.netWorthDelta)).toBeLessThanOrEqual(
      Math.abs(attribution.residualCents) + 100,
    );
  });

  it('buildNetWorthAttribution matches audit snapshot field', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as { input: SixMonthTickInput };

    const result = tickSixMonths(fixture.input);
    const built = buildNetWorthAttribution({
      netWorthDelta: result.audit.netWorthDelta,
      transactions: result.transactions,
      waterfall: result.audit.waterfall,
    });

    expect(result.audit.attribution?.contributionCents).toBe(built.contributionCents);
    expect(result.audit.attribution?.returnCents).toBe(built.returnCents);
  });
});
