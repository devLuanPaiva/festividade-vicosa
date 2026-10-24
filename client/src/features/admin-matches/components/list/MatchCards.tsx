import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { MatchListRow } from '../../lib/match-list-row';
import { StatusBadge } from './StatusBadge';

interface MatchCardsProps {
  rows: MatchListRow[];
}

function Card({ row }: { row: MatchListRow }): ReactElement {
  return (
    <li>
      <Link
        href={`${ADMIN_MATCHES_PATH}/${row.id}`}
        className="flex flex-col gap-2 p-4 transition-colors hover:bg-admin-canvas"
      >
        <span className="flex items-center justify-between gap-3 text-xs text-admin-muted">
          <span className="truncate">
            {row.category} · {row.stage}
          </span>
          <span className="shrink-0">{row.when}</span>
        </span>
        <span className="font-semibold text-brand-700">
          {row.teamA} <span className="text-admin-muted">x</span> {row.teamB}
        </span>
        <span className="flex items-center justify-between gap-3">
          <StatusBadge status={row.status} label={row.statusLabel} />
          {row.result ? <span className="font-bold">{row.result}</span> : null}
        </span>
        <span className="text-sm text-admin-muted">{row.location}</span>
      </Link>
    </li>
  );
}

export function MatchCards({ rows }: MatchCardsProps): ReactElement {
  return (
    <ul className="divide-y divide-admin-line">
      {rows.map((row) => (
        <Card key={row.id} row={row} />
      ))}
    </ul>
  );
}
