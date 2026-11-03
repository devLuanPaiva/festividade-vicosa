import type { ReactElement } from 'react';
import type { MatchListItem } from '../types';
import { BracketMatchCard } from './BracketMatchCard';

interface BracketExtraMatchesProps {
  title: string;
  matches: MatchListItem[];
}

export function BracketExtraMatches({
  title,
  matches,
}: BracketExtraMatchesProps): ReactElement | null {
  if (matches.length === 0) {
    return null;
  }
  return (
    <div className="mt-10">
      <h3 className="mb-4 font-display text-3xl text-sun">{title}</h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <li key={match.id}>
            <BracketMatchCard match={match} />
          </li>
        ))}
      </ul>
    </div>
  );
}
