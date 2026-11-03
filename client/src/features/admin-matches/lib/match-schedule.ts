import { formatMatchTime, toDayKey } from '@/features/games/lib/match-dates';

const FORTALEZA_UTC_OFFSET = '-03:00';

export function toScheduledAt(date: string, time: string): string {
  return date && time ? `${date}T${time}:00${FORTALEZA_UTC_OFFSET}` : '';
}

export function toDateInput(scheduledAt: string): string {
  return toDayKey(scheduledAt);
}

export function toTimeInput(scheduledAt: string): string {
  return formatMatchTime(scheduledAt);
}
