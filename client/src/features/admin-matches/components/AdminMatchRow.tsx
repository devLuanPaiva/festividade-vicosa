import Link from 'next/link';
import type { ReactElement } from 'react';
import { formatMatchTime } from '@/features/games/lib/match-dates';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import type { MatchListItem } from '@/features/games/types';
import { resultSummary } from '../lib/admin-match-labels';

interface AdminMatchRowProps {
  match: MatchListItem;
}

export function AdminMatchRow({ match }: AdminMatchRowProps): ReactElement {
  const isFinalized = match.status === 'FINALIZED';
  return (
    <Link
      href={`/admin/partidas/${match.id}`}
      className="flex min-h-16 flex-col gap-1 rounded-2xl border border-admin-line bg-admin-surface p-4 transition-colors hover:border-brand-500"
    >
      <span className="flex items-center justify-between gap-3 text-xs text-admin-muted">
        <span className="truncate">
          {categoryLabel(match.category)} · {stageLabel(match)}
        </span>
        <time dateTime={match.scheduledAt}>{formatMatchTime(match.scheduledAt)}</time>
      </span>
      <span className="font-semibold">
        {match.teamA.name} <span className="text-admin-muted">x</span> {match.teamB.name}
      </span>
      <span className={`text-sm ${isFinalized ? 'text-success' : 'text-admin-muted'}`}>
        {resultSummary(match)}
      </span>
    </Link>
  );
}
