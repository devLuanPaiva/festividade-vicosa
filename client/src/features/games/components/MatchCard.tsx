import Link from 'next/link';
import type { ReactElement } from 'react';
import { formatMatchTime } from '../lib/match-dates';
import { categoryLabel, stageLabel } from '../lib/match-labels';
import { getMatchOutcome } from '../lib/match-outcome';
import type { MatchListItem } from '../types';
import { MatchTeamRow } from './MatchTeamRow';

interface MatchCardProps {
  match: MatchListItem;
}

export function MatchCard({ match }: MatchCardProps): ReactElement {
  const outcome = getMatchOutcome(match);
  const details = [stageLabel(match), match.location].filter(Boolean).join(' · ');
  return (
    <Link
      href={`/jogos/${match.id}`}
      className="group relative block h-full overflow-hidden rounded-3xl bg-white p-5 text-ink shadow-[0_10px_30px_rgba(7,59,134,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(7,59,134,0.22)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-sun/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
      />
      <div className="relative flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-brand-600">
          {categoryLabel(match.category)}
        </p>
        <time
          dateTime={match.scheduledAt}
          className="rounded-full bg-sun px-3 py-0.5 font-display text-xl leading-snug text-brand-900"
        >
          {formatMatchTime(match.scheduledAt)}
        </time>
      </div>
      <div className="relative mt-4 flex flex-col gap-3">
        <MatchTeamRow team={match.teamA} outcome={outcome.sideA} />
        <MatchTeamRow team={match.teamB} outcome={outcome.sideB} />
      </div>
      <p className="relative mt-4 truncate text-xs text-ink-soft">
        {outcome.note ? `${outcome.note} · ` : ''}
        {details}
      </p>
    </Link>
  );
}
