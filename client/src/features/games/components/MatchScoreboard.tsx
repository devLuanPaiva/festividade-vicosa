import type { ReactElement } from 'react';
import type { SideOutcome } from '../lib/match-outcome';
import type { Team } from '../types';
import { TeamBadge } from './TeamBadge';

interface ScoreboardSideProps {
  team: Team;
  outcome: SideOutcome;
}

function ScoreboardSide({ team, outcome }: ScoreboardSideProps): ReactElement {
  const dimmed = outcome.isWinner ? '' : 'opacity-80';
  return (
    <div className={`flex min-w-0 flex-col items-center gap-2 text-center ${dimmed}`}>
      <TeamBadge team={team} size="large" />
      <p className="font-display text-2xl leading-none wrap-anywhere md:text-5xl">{team.name}</p>
      <p className="text-sm text-white/70">{team.city}</p>
    </div>
  );
}

interface MatchScoreboardProps {
  teamA: Team;
  teamB: Team;
  sideA: SideOutcome;
  sideB: SideOutcome;
  note: string | null;
}

export function MatchScoreboard({
  teamA,
  teamB,
  sideA,
  sideB,
  note,
}: MatchScoreboardProps): ReactElement {
  const hasPenalties = sideA.penalties !== null && sideB.penalties !== null;
  return (
    <div className="mt-10 rounded-[2rem] bg-white/10 p-4 ring-1 ring-white/25 backdrop-blur sm:p-6 md:p-10">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        <ScoreboardSide team={teamA} outcome={sideA} />
        <p
          aria-label={`Placar: ${sideA.score} a ${sideB.score}`}
          className="mt-3 shrink-0 font-display text-5xl leading-none text-sun sm:mt-6 sm:text-7xl md:mt-10 md:text-9xl"
        >
          {sideA.score}
          <span className="px-1 text-white/60 sm:px-2 md:px-4">x</span>
          {sideB.score}
        </p>
        <ScoreboardSide team={teamB} outcome={sideB} />
      </div>
      {hasPenalties ? (
        <p className="mt-6 text-center font-semibold text-sun">
          Pênaltis: {sideA.penalties} x {sideB.penalties}
        </p>
      ) : null}
      {note ? <p className="mt-4 text-center font-semibold text-sun">{note}</p> : null}
    </div>
  );
}
