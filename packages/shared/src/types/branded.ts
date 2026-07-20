/** Branded nominal types for financial values (compile-time safety, JSON as number). */

declare const MoneyCentsBrand: unique symbol;
declare const BasisPointsBrand: unique symbol;
declare const TaxYearBrand: unique symbol;

export type BrandedMoneyCents = number & { readonly [MoneyCentsBrand]: typeof MoneyCentsBrand };
export type BrandedBasisPoints = number & { readonly [BasisPointsBrand]: typeof BasisPointsBrand };
export type BrandedTaxYear = number & { readonly [TaxYearBrand]: typeof TaxYearBrand };

export function moneyCents(value: number): BrandedMoneyCents {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`Invalid MoneyCents: ${value}`);
  }
  return value as BrandedMoneyCents;
}

export function basisPoints(value: number): BrandedBasisPoints {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid BasisPoints: ${value}`);
  }
  return value as BrandedBasisPoints;
}

export function taxYear(value: number): BrandedTaxYear {
  if (!Number.isInteger(value) || value < 2000 || value > 2100) {
    throw new Error(`Invalid TaxYear: ${value}`);
  }
  return value as BrandedTaxYear;
}

/** Parse JSON number as branded cents (runtime guard for imports). */
export function parseMoneyCents(value: unknown): BrandedMoneyCents {
  if (typeof value !== 'number') {
    throw new Error('Expected number for MoneyCents');
  }
  return moneyCents(value);
}

export function unwrapMoneyCents(value: BrandedMoneyCents): number {
  return value as number;
}
