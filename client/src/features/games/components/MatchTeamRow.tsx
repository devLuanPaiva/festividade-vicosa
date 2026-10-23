import type { ReactElement } from 'react';
import type { SideOutcome } from '../lib/match-outcome';
import type { Team } from '../types';
import { TeamBadge } from './TeamBadge';

interface MatchTeamRowProps {
  team: Team;
  outcome: SideOutcome;
}

export function MatchTeamRow({ team, outcome }: MatchTeamRowProps): ReactElement {
  const emphasis = outcome.isWinner ? 'font-bold text-brand-900' : 'font-medium text-ink-soft';
  return (
    <div className="flex items-center gap-3">
      <TeamBadge team={team} />
      <span className={`min-w-0 flex-1 truncate ${emphasis}`}>{team.name}</span>
      {outcome.penalties === null ? null : (
        <span className="text-xs text-ink-soft">({outcome.penalties})</span>
      )}
      <span className={`w-8 text-right font-display text-3xl leading-none ${emphasis}`}>
        {outcome.score}
      </span>
    </div>
  );
}
