import type { MatchListItem } from '../types';
import { formatDayHeading, toDayKey } from './match-dates';

export interface MatchDay {
  key: string;
  heading: string;
  matches: MatchListItem[];
}

export function groupMatchesByDay(matches: MatchListItem[]): MatchDay[] {
  const days = new Map<string, MatchDay>();
  for (const match of matches) {
    const key = toDayKey(match.scheduledAt);
    const day = days.get(key) ?? {
      key,
      heading: formatDayHeading(match.scheduledAt),
      matches: [],
    };
    day.matches.push(match);
    days.set(key, day);
  }
  return [...days.values()];
}
