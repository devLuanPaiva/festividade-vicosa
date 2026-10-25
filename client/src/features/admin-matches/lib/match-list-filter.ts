import { toDayKey } from '@/features/games/lib/match-dates';
import { categoryLabel } from '@/features/games/lib/match-labels';
import type { MatchListItem } from '@/features/games/types';
import { normalizeSearch } from '@/lib/text/normalize-search';
import type { MatchListQuery, SortOrder, StatusFilter } from './match-list-query';

export type StatusCounts = Record<StatusFilter, number>;

const STATUS_PREDICATES: Record<StatusFilter, (match: MatchListItem, now: Date) => boolean> = {
  todas: () => true,
  hoje: (match, now) => toDayKey(match.scheduledAt) === toDayKey(now.toISOString()),
  atrasadas: (match, now) => match.status === 'SCHEDULED' && new Date(match.scheduledAt) < now,
  agendadas: (match) => match.status === 'SCHEDULED',
  finalizadas: (match) => match.status === 'FINALIZED',
};

function searchableText(match: MatchListItem): string {
  return normalizeSearch(
    [match.teamA.name, match.teamB.name, categoryLabel(match.category), match.location ?? ''].join(
      ' ',
    ),
  );
}

type ScopeCheck = (match: MatchListItem, query: MatchListQuery, wanted: string) => boolean;

const SCOPE_CHECKS: ScopeCheck[] = [
  (match, query) => query.categoryId === '' || match.categoryId === query.categoryId,
  (match, query) => query.day === '' || toDayKey(match.scheduledAt) === query.day,
  (match, query) =>
    query.stage === 'todas' || match.stage === (query.stage === 'grupos' ? 'GROUP' : 'KNOCKOUT'),
  (match, _query, wanted) => wanted === '' || searchableText(match).includes(wanted),
];

export function filterByScope(matches: MatchListItem[], query: MatchListQuery): MatchListItem[] {
  const wanted = normalizeSearch(query.search);
  return matches.filter((match) => SCOPE_CHECKS.every((check) => check(match, query, wanted)));
}

export function filterByStatus(
  matches: MatchListItem[],
  status: StatusFilter,
  now: Date,
): MatchListItem[] {
  return matches.filter((match) => STATUS_PREDICATES[status](match, now));
}

export function countByStatus(matches: MatchListItem[], now: Date): StatusCounts {
  const counts = { todas: 0, hoje: 0, atrasadas: 0, agendadas: 0, finalizadas: 0 };
  for (const status of Object.keys(counts) as StatusFilter[]) {
    counts[status] = filterByStatus(matches, status, now).length;
  }
  return counts;
}

export function sortByDate(matches: MatchListItem[], order: SortOrder): MatchListItem[] {
  const direction = order === 'asc' ? 1 : -1;
  return [...matches].sort(
    (first, second) =>
      direction * (new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime()),
  );
}
