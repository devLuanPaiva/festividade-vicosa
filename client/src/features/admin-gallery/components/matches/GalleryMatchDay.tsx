import Link from 'next/link';
import type { ReactElement } from 'react';
import { StatusBadge } from '@/features/admin-matches/components/list/StatusBadge';
import { toMatchListRow } from '@/features/admin-matches/lib/match-list-row';
import type { MatchDay } from '@/features/games/lib/group-matches-by-day';
import { formatMatchTime } from '@/features/games/lib/match-dates';
import { matchGalleryPath } from '../../lib/admin-gallery-paths';

interface GalleryMatchDayProps {
  subEventId: string;
  day: MatchDay;
  now: Date;
}

export function GalleryMatchDay({ subEventId, day, now }: GalleryMatchDayProps): ReactElement {
  return (
    <section aria-label={day.heading} className="flex min-w-0 flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wider text-admin-muted">{day.heading}</h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {day.matches.map((match) => {
          const row = toMatchListRow(match, now);
          return (
            <li key={match.id} className="min-w-0">
              <Link
                href={matchGalleryPath(subEventId, match.id)}
                className="flex h-full flex-col gap-3 rounded-2xl border border-admin-line bg-admin-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-3 text-xs text-admin-muted">
                  <span className="min-w-0 truncate font-semibold uppercase tracking-wide">
                    {row.category}
                  </span>
                  <span className="shrink-0">{formatMatchTime(match.scheduledAt)}</span>
                </span>
                <span className="flex flex-col gap-0.5 break-words font-bold leading-tight text-brand-700">
                  <span>{row.teamA}</span>
                  <span className="text-xs font-semibold uppercase text-admin-muted">contra</span>
                  <span>{row.teamB}</span>
                </span>
                <span className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-admin-line pt-3">
                  <StatusBadge status={row.status} label={row.statusLabel} />
                  {row.result ? <span className="font-bold">{row.result}</span> : null}
                </span>
                <span className="truncate text-xs text-admin-muted">{row.stage}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
