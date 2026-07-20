import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { netWorth, validateInvariants } from '@fad/ledger';
import type { CareerState, IsoDate, MacroRegime } from '@fad/shared';
import {
  BASELINE_MONTHLY_LAYOFF_RATE,
  REGIME_DEFINITIONS,
  createMacroState,
  createRng,
  layoffClimateForRegime,
  monthlyLayoffHazard,
  rollLayoff,
  sampleMonthlyReturn,
  tickMonthsWithSimulation,
} from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('createRng', () => {
  it('is deterministic for the same seed', () => {
    const a = createRng('test-seed');
    const b = createRng('test-seed');
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('differs for different seeds', () => {
    const a = createRng('seed-a');
    const b = createRng('seed-b');
    expect(a()).not.toBe(b());
  });
});

describe('macro regimes', () => {
  it('defines expansion and recession layoff multipliers', () => {
    expect(layoffClimateForRegime('expansion')).toBe(0.8);
    expect(layoffClimateForRegime('severe_recession')).toBe(2.5);
    expect(REGIME_DEFINITIONS.mild_recession.layoffClimateMultiplier).toBeGreaterThan(
      REGIME_DEFINITIONS.expansion.layoffClimateMultiplier,
    );
  });

  it('builds macro state from regime', () => {
    const macro = createMacroState('expansion');
    expect(macro.regime).toBe('expansion');
    expect(macro.layoffClimate).toBe(0.8);
    expect(macro.mortgageRate30y).toBe(0.0655);
  });
});

describe('layoff hazard', () => {
  const w2Career: CareerState = {
    sector: 'tech',
    title: 'Engineer',
    employmentType: 'w2',
    baseSalaryAnnual: 120_000_00,
    tenureMonths: 12,
    unemploymentWeeks: 0,
  };

  it('scales hazard by macro layoff climate', () => {
    const expansion = createMacroState('expansion');
    const recession = createMacroState('severe_recession');

    const expansionHazard = monthlyLayoffHazard(w2Career, expansion);
    const recessionHazard = monthlyLayoffHazard(w2Career, recession);

    expect(expansionHazard).toBeCloseTo(BASELINE_MONTHLY_LAYOFF_RATE * 0.8, 10);
    expect(recessionHazard).toBeCloseTo(BASELINE_MONTHLY_LAYOFF_RATE * 2.5, 10);
    expect(recessionHazard).toBeGreaterThan(expansionHazard);
  });

  it('modifies career state when layoff roll succeeds', () => {
    const macro = createMacroState('severe_recession');
    let rollCount = 0;
    let laidOff = false;

    for (let i = 0; i < 500; i++) {
      const rng = createRng(`layoff-force-${i}`);
      const result = rollLayoff(w2Career, macro, rng);
      rollCount += 1;
      if (result.laidOff) {
        laidOff = true;
        expect(result.career.employmentType).toBe('unemployed');
        break;
      }
    }

    expect(rollCount).toBeGreaterThan(0);
    expect(laidOff).toBe(true);
  });
});

describe('market returns', () => {
  it('samples regime-conditioned returns', () => {
    const rng = createRng('return-sample');
    const expansionReturn = sampleMonthlyReturn('expansion', rng);
    const recessionRng = createRng('return-sample');
    recessionRng();
    const recessionReturn = sampleMonthlyReturn('severe_recession', recessionRng);

    expect(Number.isFinite(expansionReturn)).toBe(true);
    expect(Number.isFinite(recessionReturn)).toBe(true);
  });
});

type DeterminismFixture = {
  description: string;
  input: {
    startDate: IsoDate;
    months: number;
    randomSeed: string;
    accounts: Parameters<typeof tickMonthsWithSimulation>[0]['accounts'];
    debts: Parameters<typeof tickMonthsWithSimulation>[0]['debts'];
    career: CareerState;
    location: Parameters<typeof tickMonthsWithSimulation>[0]['location'];
    macro: { regime: MacroRegime };
    deferral401kRate?: number;
  };
  expected: {
    endDate: IsoDate;
    netWorth: number;
    layoffCount: number;
    employmentType: CareerState['employmentType'];
    brokerageBalance: number;
    traditional401kBalance: number;
    monthlyReturns: number[];
  };
};

describe('tickMonthsWithSimulation', () => {
  it('is deterministic for same seed over 12 months', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/twelve-month-determinism.json'), 'utf8'),
    ) as DeterminismFixture;

    const input = {
      ...fixture.input,
      macro: createMacroState(fixture.input.macro.regime),
    };

    const first = tickMonthsWithSimulation(input);
    const second = tickMonthsWithSimulation(input);

    expect(first.endDate).toBe(fixture.expected.endDate);
    expect(first.layoffCount).toBe(fixture.expected.layoffCount);
    expect(first.career.employmentType).toBe(fixture.expected.employmentType);
    expect(first.monthlyReturns).toHaveLength(fixture.expected.monthlyReturns.length);
    first.monthlyReturns.forEach((value, index) => {
      const expected = fixture.expected.monthlyReturns[index];
      expect(expected).toBeDefined();
      expect(value).toBeCloseTo(expected!, 10);
    });

    const firstNetWorth = netWorth(first.accounts, first.debts);
    const secondNetWorth = netWorth(second.accounts, second.debts);

    expect(firstNetWorth).toBe(fixture.expected.netWorth);
    expect(secondNetWorth).toBe(firstNetWorth);
    expect(first.accounts.brokerage.balance).toBe(fixture.expected.brokerageBalance);
    expect(first.accounts.traditional401k.balance).toBe(fixture.expected.traditional401kBalance);

    expect(validateInvariants(first.accounts, first.debts, first.transactions)).toHaveLength(0);
  });

  it('posts investment returns from seeded simulation', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/twelve-month-determinism.json'), 'utf8'),
    ) as DeterminismFixture;

    const result = tickMonthsWithSimulation({
      ...fixture.input,
      macro: createMacroState(fixture.input.macro.regime),
    });

    const returnTxs = result.transactions.filter((tx) => tx.source === 'investment_return');
    expect(returnTxs.length).toBeGreaterThan(0);
  });
});
