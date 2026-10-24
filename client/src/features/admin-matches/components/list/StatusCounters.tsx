import Link from 'next/link';
import type { ReactElement } from 'react';
import type { StatusCounts } from '../../lib/match-list-filter';
import {
  buildMatchListHref,
  type MatchListQuery,
  type StatusFilter,
} from '../../lib/match-list-query';

interface StatusCountersProps {
  query: MatchListQuery;
  counts: StatusCounts;
}

const STATUS_LABELS: [StatusFilter, string][] = [
  ['todas', 'Todas'],
  ['hoje', 'Hoje'],
  ['atrasadas', 'Sem resultado'],
  ['agendadas', 'Agendadas'],
  ['finalizadas', 'Finalizadas'],
];

function toneFor(isActive: boolean, needsAttention: boolean): string {
  if (isActive) {
    return 'border-brand-600 bg-brand-600 text-white';
  }
  return needsAttention
    ? 'border-danger/40 bg-danger/5 text-danger hover:border-danger'
    : 'border-admin-line bg-admin-surface hover:border-brand-500';
}

export function StatusCounters({ query, counts }: StatusCountersProps): ReactElement {
  return (
    <nav aria-label="Situação das partidas" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {STATUS_LABELS.map(([status, label]) => {
        const isActive = query.status === status;
        const needsAttention = status === 'atrasadas' && counts[status] > 0;
        return (
          <Link
            key={status}
            href={buildMatchListHref(query, { status })}
            aria-current={isActive ? 'true' : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${toneFor(isActive, needsAttention)}`}
          >
            {label}
            <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-xs tabular-nums">
              {counts[status]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
