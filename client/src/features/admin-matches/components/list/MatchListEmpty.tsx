import Link from 'next/link';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { buildMatchListHref, DEFAULT_MATCH_LIST_QUERY } from '../../lib/match-list-query';

interface MatchListEmptyProps {
  hasAnyMatch: boolean;
  newMatchHref: string | null;
}

const ACTION_CLASS =
  'inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700';

export function MatchListEmpty({ hasAnyMatch, newMatchHref }: MatchListEmptyProps): ReactElement {
  if (hasAnyMatch) {
    return (
      <EmptyState
        tone="admin"
        icon="search"
        title="Nenhuma partida encontrada"
        description="Nada combina com a busca e os filtros atuais. Tente outro nome ou limpe os filtros."
      >
        <Link href={buildMatchListHref(DEFAULT_MATCH_LIST_QUERY)} className={ACTION_CLASS}>
          Limpar busca e filtros
        </Link>
      </EmptyState>
    );
  }
  return (
    <EmptyState
      tone="admin"
      icon="calendar"
      title="Nenhuma partida cadastrada ainda"
      description="Cadastre os jogos da fase de grupos e do mata-mata para lançar os placares por aqui."
    >
      {newMatchHref ? (
        <Link href={newMatchHref} className={ACTION_CLASS}>
          Nova partida
        </Link>
      ) : null}
    </EmptyState>
  );
}
