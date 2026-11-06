import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { MatchListRow, RowStatus } from '../../lib/match-list-row';
import { StatusBadge } from './StatusBadge';

const ACCENT_CLASSES: Record<RowStatus, string> = {
  finalized: 'before:bg-success',
  overdue: 'before:bg-danger',
  scheduled: 'before:bg-brand-500',
};

interface MatchCardsProps {
  rows: MatchListRow[];
}

function Card({ row }: { row: MatchListRow }): ReactElement {
  return (
    <li>
      <Link
        href={`${ADMIN_MATCHES_PATH}/${row.id}`}
        className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-admin-line bg-admin-surface p-4 pt-5 shadow-sm transition-all before:absolute before:inset-x-0 before:top-0 before:h-1 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md ${ACCENT_CLASSES[row.status]}`}
      >
        <span className="flex items-center justify-between gap-3 text-xs text-admin-muted">
          <span className="truncate font-semibold uppercase tracking-wide">{row.category}</span>
          <span className="shrink-0">{row.when}</span>
        </span>
        <span className="flex flex-col gap-1 text-lg font-bold leading-tight text-brand-700">
          <span>{row.teamA}</span>
          <span className="text-xs font-semibold uppercase text-admin-muted">contra</span>
          <span>{row.teamB}</span>
        </span>
        <span className="mt-auto flex items-center justify-between gap-3 border-t border-admin-line pt-3">
          <StatusBadge status={row.status} label={row.statusLabel} />
          {row.result ? <span className="font-bold">{row.result}</span> : null}
        </span>
        <span className="flex items-center justify-between gap-2 text-sm text-admin-muted">
          <span className="truncate">{row.location}</span>
          <span className="shrink-0">{row.stage}</span>
        </span>
      </Link>
    </li>
  );
}

export function MatchCards({ rows }: Readonly<MatchCardsProps>): ReactElement {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <Card key={row.id} row={row} />
      ))}
    </ul>
  );
}
