export { createRng } from './rng.js';
export { tickSixMonths, exportAuditJson } from '@fad/ledger';
export type { SixMonthTickInput, SixMonthTickResult } from '@fad/ledger';

// Stub - T005
export function tickMonth(): void {
  throw new Error('tickMonth not implemented - see beads T005');
}
