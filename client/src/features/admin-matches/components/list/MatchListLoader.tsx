import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { getAdminCategories } from '@/features/admin-teams/services/get-admin-categories';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { CHOOSE_CATEGORY_FOR_MATCH_PATH, newMatchPath } from '../../lib/admin-match-paths';
import { buildActiveFilters } from '../../lib/match-list-chips';
import { buildScopeParams, situationParam, toStatusCounts } from '../../lib/match-list-api';
import { buildDayOptions } from '../../lib/match-list-options';
import { parseMatchListQuery, type RawSearchParams } from '../../lib/match-list-query';
import { toMatchListRow } from '../../lib/match-list-row';
import { getMatchDays, getMatchPage, getMatchSituations } from '../../services/get-match-page';
import { MatchListView } from './MatchListView';

interface MatchListLoaderProps {
  searchParams: Promise<RawSearchParams>;
}

export async function MatchListLoader({
  searchParams,
}: Readonly<MatchListLoaderProps>): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:record-score')) {
    return <NoPermission action="lançar placares" />;
  }
  const query = parseMatchListQuery(await searchParams);
  const scope = buildScopeParams(query);
  const [page, counts, dayValues, modalities] = await Promise.all([
    getMatchPage({
      scope,
      situation: situationParam(query.status),
      order: query.order,
      page: query.page,
      pageSize: query.pageSize,
    }),
    getMatchSituations(scope),
    getMatchDays({}),
    getAdminCategories(),
  ]);
  const now = new Date();
  const days = buildDayOptions(dayValues);
  const activeFilters = buildActiveFilters(query, modalities, days);
  const newMatchHref = query.categoryId
    ? newMatchPath(query.categoryId)
    : CHOOSE_CATEGORY_FOR_MATCH_PATH;
  return (
    <MatchListView
      query={query}
      page={{ ...page, items: page.items.map((match) => toMatchListRow(match, now)) }}
      counts={toStatusCounts(counts)}
      modalities={modalities}
      days={days}
      activeFilters={activeFilters}
      hasAnyMatch={page.total > 0 || activeFilters.length > 0}
      newMatchHref={hasPermission(user, 'match:create') ? newMatchHref : null}
    />
  );
}
