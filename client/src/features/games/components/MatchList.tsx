import type { ReactElement } from 'react';
import { groupMatchesByDay } from '../lib/group-matches-by-day';
import type { MatchScope } from '../lib/game-filters';
import type { MatchListItem } from '../types';
import { MatchDayGroup } from './MatchDayGroup';

const EMPTY_MESSAGES: Record<MatchScope, string> = {
  proximos: 'Nenhum jogo agendado com esses filtros. Tente outra categoria ou veja os finalizados.',
  finalizados: 'Ainda não há jogos finalizados com esses filtros.',
};

interface MatchListProps {
  matches: MatchListItem[];
  scope: MatchScope;
}

export function MatchList({ matches, scope }: MatchListProps): ReactElement {
  if (matches.length === 0) {
    return (
      <p className="rounded-3xl bg-white p-8 text-center text-ink-soft shadow-[0_10px_30px_rgba(7,59,134,0.1)]">
        {EMPTY_MESSAGES[scope]}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-12">
      {groupMatchesByDay(matches).map((day) => (
        <MatchDayGroup key={day.key} day={day} />
      ))}
    </div>
  );
}
