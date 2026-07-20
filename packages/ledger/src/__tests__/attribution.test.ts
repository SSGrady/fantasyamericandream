import { describe, expect, it } from 'vitest';
import { buildNetWorthAttribution, tickSixMonths } from '../index.js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SixMonthTickInput } from '../audit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('net worth attribution', () => {
  it('reconciles choice + luck - lifestyle + residual to net worth delta (1 cent tolerance)', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as { input: SixMonthTickInput };

    const result = tickSixMonths(fixture.input);
    const attribution = result.audit.attribution!;
    const endingMinusStarting = result.audit.netWorthDelta;
    const reconstructed =
      attribution.choiceCents +
      attribution.returnCents -
      attribution.lifestyleLeakageCents +
      attribution.residualCents;

    expect(Math.abs(reconstructed - endingMinusStarting)).toBeLessThanOrEqual(1);
    expect(attribution.contributionCents).toBeGreaterThan(0);
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
