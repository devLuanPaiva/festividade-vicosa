const FORTALEZA_UTC_OFFSET_MS = -3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const PERCENT = 100;
const AVERAGE_PRECISION = 100;

export interface DayRange {
  start: Date;
  end: Date;
}

export function dayRangeInFortaleza(now: Date): DayRange {
  const local = new Date(now.getTime() + FORTALEZA_UTC_OFFSET_MS);
  const localMidnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = new Date(localMidnight - FORTALEZA_UTC_OFFSET_MS);
  return { start, end: new Date(start.getTime() + DAY_MS) };
}

export function toPercentage(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * PERCENT);
}

export function averagePerMatch(goals: number, playedMatches: number): number {
  return playedMatches === 0
    ? 0
    : Math.round((goals / playedMatches) * AVERAGE_PRECISION) / AVERAGE_PRECISION;
}
