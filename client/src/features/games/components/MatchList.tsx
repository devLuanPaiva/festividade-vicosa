import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { groupMatchesByDay } from '../lib/group-matches-by-day';
import type { MatchScope } from '../lib/game-filters';
import type { MatchListItem } from '../types';
import { MatchDayGroup } from './MatchDayGroup';

const EMPTY_STATES: Record<MatchScope, { title: string; description: string }> = {
  proximos: {
    title: 'Nenhum jogo agendado',
    description: 'Nada combina com esses filtros. Tente outra categoria ou veja os finalizados.',
  },
  finalizados: {
    title: 'Ainda não há jogos finalizados',
    description: 'Os resultados aparecem aqui assim que as partidas terminarem.',
  },
};

interface MatchListProps {
  matches: MatchListItem[];
  scope: MatchScope;
}

export function MatchList({ matches, scope }: MatchListProps): ReactElement {
  if (matches.length === 0) {
    return <EmptyState icon="ball" {...EMPTY_STATES[scope]} />;
  }
  return (
    <div className="flex flex-col gap-12">
      {groupMatchesByDay(matches).map((day) => (
        <MatchDayGroup key={day.key} day={day} />
      ))}
    </div>
  );
}
