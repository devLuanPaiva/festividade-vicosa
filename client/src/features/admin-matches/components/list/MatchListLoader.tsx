import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { getAdminCategories } from '@/features/admin-teams/services/get-admin-categories';
import { requireCurrentUser, requireSessionToken } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { CHOOSE_CATEGORY_FOR_MATCH_PATH, newMatchPath } from '../../lib/admin-match-paths';
import { buildActiveFilters } from '../../lib/match-list-chips';
import { buildMatchListData } from '../../lib/match-list-data';
import { buildDayOptions } from '../../lib/match-list-options';
import { parseMatchListQuery, type RawSearchParams } from '../../lib/match-list-query';
import { getAdminMatches } from '../../services/get-admin-matches';
import { MatchListView } from './MatchListView';

interface MatchListLoaderProps {
  searchParams: Promise<RawSearchParams>;
}

export async function MatchListLoader({
  searchParams,
}: MatchListLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:record-score')) {
    return <NoPermission action="lançar placares" />;
  }
  const query = parseMatchListQuery(await searchParams);
  const [matches, modalities] = await Promise.all([
    getAdminMatches(await requireSessionToken()),
    getAdminCategories(),
  ]);
  const days = buildDayOptions(matches);
  const canCreate = hasPermission(user, 'match:create');
  const newMatchHref = query.categoryId
    ? newMatchPath(query.categoryId)
    : CHOOSE_CATEGORY_FOR_MATCH_PATH;
  return (
    <MatchListView
      query={query}
      {...buildMatchListData(matches, query, new Date())}
      modalities={modalities}
      days={days}
      activeFilters={buildActiveFilters(query, modalities, days)}
      hasAnyMatch={matches.length > 0}
      newMatchHref={canCreate ? newMatchHref : null}
    />
  );
}
