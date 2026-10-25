import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { MatchListRow } from '../../lib/match-list-row';
import { buildMatchListHref, type MatchListQuery } from '../../lib/match-list-query';
import { StatusBadge } from './StatusBadge';

interface MatchesTableProps {
  rows: MatchListRow[];
  query: MatchListQuery;
}

const HEADER_CLASS =
  'px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-admin-muted';

function SortHeader({ query }: { query: MatchListQuery }): ReactElement {
  const next = query.order === 'asc' ? 'desc' : 'asc';
  const arrow = query.order === 'asc' ? '↑' : '↓';
  return (
    <th
      scope="col"
      aria-sort={query.order === 'asc' ? 'ascending' : 'descending'}
      className={HEADER_CLASS}
    >
      <Link
        href={buildMatchListHref(query, { order: next })}
        className="inline-flex min-h-9 items-center gap-1 hover:text-admin-ink"
      >
        Data e hora <span aria-hidden="true">{arrow}</span>
      </Link>
    </th>
  );
}

function Row({ row }: { row: MatchListRow }): ReactElement {
  return (
    <tr className="relative border-t border-admin-line transition-colors hover:bg-admin-canvas">
      <td className="whitespace-nowrap px-4 py-3 text-sm text-admin-muted">{row.when}</td>
      <td className="px-4 py-3">
        <Link
          href={`${ADMIN_MATCHES_PATH}/${row.id}`}
          className="font-semibold text-brand-700 after:absolute after:inset-0"
        >
          {row.teamA} <span className="text-admin-muted">x</span> {row.teamB}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm">
        {row.category}
        <span className="block text-admin-muted">{row.stage}</span>
      </td>
      <td className="px-4 py-3 text-sm text-admin-muted">{row.location}</td>
      <td className="px-4 py-3">
        <StatusBadge status={row.status} label={row.statusLabel} />
        {row.result ? <span className="mt-1 block text-sm font-bold">{row.result}</span> : null}
      </td>
      <td aria-hidden="true" className="w-8 pr-4 text-admin-muted">
        ›
      </td>
    </tr>
  );
}

export function MatchesTable({ rows, query }: MatchesTableProps): ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[56rem] border-collapse">
        <caption className="sr-only">Partidas do campeonato</caption>
        <thead className="bg-admin-canvas">
          <tr>
            <SortHeader query={query} />
            <th scope="col" className={HEADER_CLASS}>
              Partida
            </th>
            <th scope="col" className={HEADER_CLASS}>
              Categoria
            </th>
            <th scope="col" className={HEADER_CLASS}>
              Local
            </th>
            <th scope="col" className={HEADER_CLASS}>
              Situação
            </th>
            <th scope="col" className="w-8">
              <span className="sr-only">Abrir</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
