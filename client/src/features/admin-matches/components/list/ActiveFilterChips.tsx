import Link from 'next/link';
import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { ActiveFilter } from '../../lib/match-list-chips';
import {
  buildMatchListHref,
  DEFAULT_MATCH_LIST_QUERY,
  type MatchListQuery,
} from '../../lib/match-list-query';

interface ActiveFilterChipsProps {
  query: MatchListQuery;
  filters: ActiveFilter[];
}

export function ActiveFilterChips({ query, filters }: ActiveFilterChipsProps): ReactElement | null {
  if (filters.length === 0) {
    return null;
  }
  return (
    <ul aria-label="Filtros ativos" className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <li key={filter.key}>
          <Link
            href={buildMatchListHref(query, { [filter.key]: DEFAULT_MATCH_LIST_QUERY[filter.key] })}
            aria-label={`Remover filtro ${filter.label}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/10 py-1 pl-3 pr-2 text-sm font-semibold text-brand-700 hover:bg-brand-500/20"
          >
            {filter.label}
            <Icon name="close" className="size-4" />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={buildMatchListHref(DEFAULT_MATCH_LIST_QUERY, {
            status: query.status,
            view: query.view,
          })}
          className="inline-flex min-h-9 items-center px-2 text-sm font-semibold text-admin-muted underline hover:text-admin-ink"
        >
          Limpar tudo
        </Link>
      </li>
    </ul>
  );
}
