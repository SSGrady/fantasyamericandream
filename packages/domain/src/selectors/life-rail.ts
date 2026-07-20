import { totalWeeklyCapacityUsed } from '@fad/shared';
import type { RunState } from '../run-state/types.js';
import { selectLiquidRunway, selectRibbonMetrics } from './metrics.js';

export interface LifeRailThread {
  id: string;
  label: string;
  kind: 'interrupt' | 'decision';
}

export interface LifeRailData {
  jobTitle: string;
  liquidRunwayMonths: number;
  weeklyCapacityHours: number;
  weeklyCapacityUsed: number;
  netWorth: number;
  openThreads: LifeRailThread[];
}

export function selectLifeRailData(state: RunState): LifeRailData {
  const metrics = selectRibbonMetrics(state);
  const weeklyCapacityHours =
    state.gameState.commandState?.weeklyCapacityHours ?? 14;
  const activeCommands = state.gameState.commandState?.activeCommands ?? [];
  const weeklyCapacityUsed = totalWeeklyCapacityUsed(activeCommands);

  const openThreads: LifeRailThread[] = [];
  if (state.activeInterrupt) {
    openThreads.push({
      id: state.activeInterrupt.id,
      label: state.activeInterrupt.title,
      kind: 'interrupt',
    });
  }
  for (const decision of state.pendingDecisions) {
    if (decision.kind === 'required') {
      openThreads.push({
        id: decision.id,
        label: decision.title,
        kind: 'decision',
      });
    }
  }

  return {
    jobTitle: state.gameState.career.title,
    liquidRunwayMonths: selectLiquidRunway(state),
    weeklyCapacityHours,
    weeklyCapacityUsed,
    netWorth: metrics.netWorth,
    openThreads,
  };
}
