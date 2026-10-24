import type { MatchListItem } from '@/features/games/types';
import {
  countByStatus,
  filterByScope,
  filterByStatus,
  sortByDate,
  type StatusCounts,
} from './match-list-filter';
import { MATCH_LIST_PAGE_SIZE, paginate, type Page } from './match-list-paginate';
import type { MatchListQuery } from './match-list-query';
import { toMatchListRow, type MatchListRow } from './match-list-row';

export interface MatchListData {
  page: Page<MatchListRow>;
  counts: StatusCounts;
}

export function buildMatchListData(
  matches: MatchListItem[],
  query: MatchListQuery,
  now: Date,
): MatchListData {
  const scoped = filterByScope(matches, query);
  const sorted = sortByDate(filterByStatus(scoped, query.status, now), query.order);
  const page = paginate(sorted, query.page, MATCH_LIST_PAGE_SIZE);
  return {
    page: { ...page, items: page.items.map((match) => toMatchListRow(match, now)) },
    counts: countByStatus(scoped, now),
  };
}
