import { toDayKey } from '@/features/games/lib/match-dates';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function toDayMonth(isoDate: string): string {
  const [, month, day] = toDayKey(isoDate).split('-');
  return `${day}/${month}`;
}

export function describeElapsed(isoDate: string, now: Date): string {
  const elapsed = now.getTime() - new Date(isoDate).getTime();
  if (elapsed < MINUTE_MS) {
    return 'agora';
  }
  if (elapsed < HOUR_MS) {
    return `há ${Math.floor(elapsed / MINUTE_MS)} min`;
  }
  if (elapsed < DAY_MS) {
    return `há ${Math.floor(elapsed / HOUR_MS)} h`;
  }
  return toDayMonth(isoDate);
}
