import type { ReactElement } from 'react';
import { PaginationBar } from '@/features/admin-shell/components/PaginationBar';
import type { Page } from '@/lib/pagination/paginate';
import { buildMatchListHref, type MatchListQuery } from '../../lib/match-list-query';

interface ListPaginationProps {
  query: MatchListQuery;
  page: Page<unknown>;
}

const NOUN = { singular: 'partida', plural: 'partidas' };

export function ListPagination({ query, page }: Readonly<ListPaginationProps>): ReactElement {
  return (
    <PaginationBar
      page={page.page}
      totalPages={page.totalPages}
      total={page.total}
      pageSize={query.pageSize}
      noun={NOUN}
      hrefFor={(changes) => buildMatchListHref(query, changes)}
    />
  );
}
