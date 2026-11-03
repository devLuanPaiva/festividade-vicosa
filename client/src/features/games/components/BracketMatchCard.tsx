import Link from 'next/link';
import type { ReactElement } from 'react';
import { formatDayHeading, formatMatchTime } from '../lib/match-dates';
import { getMatchOutcome } from '../lib/match-outcome';
import type { MatchListItem } from '../types';
import { MatchTeamRow } from './MatchTeamRow';

interface BracketMatchCardProps {
  match: MatchListItem;
}

export function BracketMatchCard({ match }: BracketMatchCardProps): ReactElement {
  const outcome = getMatchOutcome(match);
  return (
    <Link
      href={`/jogos/${match.id}`}
      className="block rounded-3xl bg-white p-4 text-ink shadow-[0_10px_30px_rgba(3,20,70,0.35)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex flex-col gap-3">
        <MatchTeamRow team={match.teamA} outcome={outcome.sideA} />
        <MatchTeamRow team={match.teamB} outcome={outcome.sideB} />
      </div>
      <p className="mt-3 text-xs text-ink-soft first-letter:uppercase">
        {formatDayHeading(match.scheduledAt)}, {formatMatchTime(match.scheduledAt)}
      </p>
    </Link>
  );
}
