import Link from 'next/link';
import type { ReactElement } from 'react';
import type { ModalityCategories } from '@/features/admin-teams/types';
import type { ActiveFilter } from '../../lib/match-list-chips';
import type { DayOption } from '../../lib/match-list-options';
import type { Page } from '../../lib/match-list-paginate';
import { toFormFields, type MatchListQuery } from '../../lib/match-list-query';
import type { MatchListRow } from '../../lib/match-list-row';
import type { StatusCounts } from '../../lib/match-list-filter';
import { ActiveFilterChips } from './ActiveFilterChips';
import { FiltersPanel } from './FiltersPanel';
import { ListPagination } from './ListPagination';
import { MatchCards } from './MatchCards';
import { MatchListEmpty } from './MatchListEmpty';
import { MatchSearch } from './MatchSearch';
import { MatchesTable } from './MatchesTable';
import { StatusCounters } from './StatusCounters';
import { ViewToggle } from './ViewToggle';

export interface MatchListViewProps {
  query: MatchListQuery;
  page: Page<MatchListRow>;
  counts: StatusCounts;
  modalities: ModalityCategories[];
  days: DayOption[];
  activeFilters: ActiveFilter[];
  hasAnyMatch: boolean;
  newMatchHref: string | null;
}

function ResultsFrame({
  query,
  page,
  hasAnyMatch,
  newMatchHref,
}: Pick<MatchListViewProps, 'query' | 'page' | 'hasAnyMatch' | 'newMatchHref'>): ReactElement {
  const showTable = query.view !== 'cards';
  const showCards = query.view !== 'tabela';
  return (
    <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
      {page.total === 0 ? (
        <MatchListEmpty hasAnyMatch={hasAnyMatch} newMatchHref={newMatchHref} />
      ) : (
        <>
          {showTable ? (
            <div className={query.view === 'auto' ? 'hidden md:block' : ''}>
              <MatchesTable rows={page.items} query={query} />
            </div>
          ) : null}
          {showCards ? (
            <div className={query.view === 'auto' ? 'md:hidden' : ''}>
              <MatchCards rows={page.items} />
            </div>
          ) : null}
        </>
      )}
      <ListPagination query={query} page={page} />
    </div>
  );
}

export function MatchListView(props: MatchListViewProps): ReactElement {
  const { query, counts, modalities, days, activeFilters, newMatchHref } = props;
  const filterFields = toFormFields(query, ['categoryId', 'stage', 'day']);
  const searchFields = toFormFields(query, ['search']);
  const selectableFilters = activeFilters.filter(({ key }) => key !== 'search').length;
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Partidas</h1>
          <p className="text-sm text-admin-muted">
            Encontre um jogo, lance o resultado e acompanhe o que ainda falta.
          </p>
        </div>
        {newMatchHref ? (
          <Link
            href={newMatchHref}
            className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
          >
            Nova partida
          </Link>
        ) : null}
      </header>
      <StatusCounters query={query} counts={counts} />
      <div className="flex flex-wrap items-center gap-2">
        <MatchSearch defaultValue={query.search} fields={searchFields} />
        <FiltersPanel
          modalities={modalities}
          days={days}
          selected={{ categoryId: query.categoryId, stage: query.stage, day: query.day }}
          fields={filterFields}
          activeCount={selectableFilters}
        />
        <ViewToggle query={query} />
      </div>
      <ActiveFilterChips query={query} filters={activeFilters} />
      <ResultsFrame
        query={query}
        page={props.page}
        hasAnyMatch={props.hasAnyMatch}
        newMatchHref={newMatchHref}
      />
    </>
  );
}
