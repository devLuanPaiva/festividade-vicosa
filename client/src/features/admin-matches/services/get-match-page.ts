import type { MatchListItem } from '@/features/games/types';
import { fetchApiCountedPage, fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import { buildPage, lastPageOf, offsetOf, type Page } from '@/lib/pagination/paginate';
import { toQueryString, type MatchScopeParams, type SituationCounts } from '../lib/match-list-api';

export interface MatchPageRequest {
  scope: MatchScopeParams;
  situation: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

function pagePath(request: MatchPageRequest, page: number): string {
  const query = toQueryString({
    ...request.scope,
    situation: request.situation,
    order: request.order,
    offset: String(offsetOf(page, request.pageSize)),
    limit: String(request.pageSize),
  });
  return `/matches?${query}`;
}

export async function getMatchPage(request: MatchPageRequest): Promise<Page<MatchListItem>> {
  const first = await fetchApiCountedPage<MatchListItem>(pagePath(request, request.page));
  const lastPage = lastPageOf(first.count, request.pageSize);
  if (request.page <= lastPage) {
    return buildPage({
      items: first.items,
      total: first.count,
      page: request.page,
      pageSize: request.pageSize,
    });
  }
  const last = await fetchApiCountedPage<MatchListItem>(pagePath(request, lastPage));
  return buildPage({
    items: last.items,
    total: last.count,
    page: lastPage,
    pageSize: request.pageSize,
  });
}

export function getMatchSituations(scope: MatchScopeParams): Promise<SituationCounts> {
  return fetchApiResult<SituationCounts>(`/match-situations?${toQueryString(scope)}`);
}

export function getMatchDays(scope: MatchScopeParams): Promise<string[]> {
  return fetchApiPage<string>(`/match-days?${toQueryString(scope)}`);
}
