import Link from 'next/link';
import type { ReactElement } from 'react';
import { formatDayHeading, formatMatchTime } from '@/features/games/lib/match-dates';
import { setLiveActiveAction } from '../actions/live-actions';
import { livePath } from '../lib/live-paths';
import type { LiveStream } from '../types';
import { LiveActivationForm } from './LiveActivationForm';

interface LiveRowProps {
  liveStream: LiveStream;
}

export function LiveRow({ liveStream }: LiveRowProps): ReactElement {
  const { id, title, startsAt, active } = liveStream;
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold">{title}</span>
          <span
            className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${
              active ? 'bg-success/15 text-success' : 'bg-admin-canvas text-admin-muted'
            }`}
          >
            {active ? 'Na home' : 'Desligada'}
          </span>
        </span>
        <span className="text-sm text-admin-muted first-letter:uppercase">
          {formatDayHeading(startsAt)}, {formatMatchTime(startsAt)}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={livePath(id)}
          className="inline-flex min-h-11 items-center font-semibold text-brand-700"
        >
          Editar
        </Link>
        <LiveActivationForm
          action={setLiveActiveAction.bind(null, id, !active)}
          isActive={active}
        />
      </div>
    </li>
  );
}
