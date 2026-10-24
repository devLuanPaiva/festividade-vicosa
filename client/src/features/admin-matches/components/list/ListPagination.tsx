import Link from 'next/link';
import type { ReactElement } from 'react';
import { buildMatchListHref, type MatchListQuery } from '../../lib/match-list-query';
import type { Page } from '../../lib/match-list-paginate';

interface ListPaginationProps {
  query: MatchListQuery;
  page: Page<unknown>;
}

const BUTTON_CLASS =
  'inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-semibold';
const ENABLED_CLASS = `${BUTTON_CLASS} border-admin-line bg-white hover:border-brand-500`;
const DISABLED_CLASS = `${BUTTON_CLASS} cursor-not-allowed border-admin-line bg-admin-canvas text-admin-muted`;

function Step({
  label,
  targetPage,
  isEnabled,
  query,
}: {
  label: string;
  targetPage: number;
  isEnabled: boolean;
  query: MatchListQuery;
}): ReactElement {
  return isEnabled ? (
    <Link href={buildMatchListHref(query, { page: targetPage })} className={ENABLED_CLASS}>
      {label}
    </Link>
  ) : (
    <span aria-disabled="true" className={DISABLED_CLASS}>
      {label}
    </span>
  );
}

export function ListPagination({ query, page }: ListPaginationProps): ReactElement {
  const noun = page.total === 1 ? 'partida' : 'partidas';
  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-line px-4 py-3"
    >
      <p className="text-sm text-admin-muted">
        Página {page.page} de {page.totalPages} · {page.total} {noun}
      </p>
      <div className="flex gap-2">
        <Step label="Anterior" targetPage={page.page - 1} isEnabled={page.page > 1} query={query} />
        <Step
          label="Próxima"
          targetPage={page.page + 1}
          isEnabled={page.page < page.totalPages}
          query={query}
        />
      </div>
    </nav>
  );
}
