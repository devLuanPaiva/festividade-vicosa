import { toDayKey } from '@/features/games/lib/match-dates';
import type { MatchListItem } from '@/features/games/types';

const UPCOMING_LIMIT = 8;
const RECENTLY_FINALIZED_LIMIT = 8;

export interface AdminMatchGroups {
  today: MatchListItem[];
  overdue: MatchListItem[];
  upcoming: MatchListItem[];
  recentlyFinalized: MatchListItem[];
}

type GroupName = keyof AdminMatchGroups;

function classifyMatch(match: MatchListItem, todayKey: string): GroupName {
  const dayKey = toDayKey(match.scheduledAt);
  if (dayKey === todayKey) {
    return 'today';
  }
  if (match.status === 'FINALIZED') {
    return 'recentlyFinalized';
  }
  return dayKey < todayKey ? 'overdue' : 'upcoming';
}

export function splitAdminMatches(matches: MatchListItem[], now: Date): AdminMatchGroups {
  const todayKey = toDayKey(now.toISOString());
  const groups: AdminMatchGroups = {
    today: [],
    overdue: [],
    upcoming: [],
    recentlyFinalized: [],
  };
  for (const match of matches) {
    groups[classifyMatch(match, todayKey)].push(match);
  }
  return {
    ...groups,
    upcoming: groups.upcoming.slice(0, UPCOMING_LIMIT),
    recentlyFinalized: groups.recentlyFinalized.slice(-RECENTLY_FINALIZED_LIMIT).reverse(),
  };
}
