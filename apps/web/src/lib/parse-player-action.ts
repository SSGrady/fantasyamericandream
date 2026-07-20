/** Parse free-text player action into simulation knobs (deterministic stub). */
export function parseDeferral401kRateFromAction(
  action: string,
  currentRate: number,
): number {
  const lower = action.toLowerCase();
  if (lower.includes('pause deferral') || lower.includes('stop 401') || lower.includes('0% deferral')) {
    return 0;
  }
  if (lower.includes('increase deferral') || lower.includes('raise 401') || lower.includes('boost deferral')) {
    return Math.min(0.22, currentRate + 0.02);
  }
  if (lower.includes('decrease deferral') || lower.includes('lower 401') || lower.includes('reduce deferral')) {
    return Math.max(0, currentRate - 0.02);
  }
  const match = lower.match(/(\d{1,2})\s*%?\s*(401|deferral)/);
  if (match) {
    const pct = Number(match[1]) / 100;
    if (pct >= 0 && pct <= 0.25) {
      return pct;
    }
  }
  return currentRate;
}
