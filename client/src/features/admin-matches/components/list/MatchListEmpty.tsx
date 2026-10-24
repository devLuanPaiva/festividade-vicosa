import Link from 'next/link';
import type { ReactElement } from 'react';
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
      <section className="flex flex-col items-start gap-2 p-6">
        <h2 className="font-bold">Nenhuma partida encontrada</h2>
        <p className="text-sm text-admin-muted">
          Nada combina com a busca e os filtros atuais. Tente outro nome ou limpe os filtros.
        </p>
        <Link href={buildMatchListHref(DEFAULT_MATCH_LIST_QUERY)} className={ACTION_CLASS}>
          Limpar busca e filtros
        </Link>
      </section>
    );
  }
  return (
    <section className="flex flex-col items-start gap-2 p-6">
      <h2 className="font-bold">Nenhuma partida cadastrada ainda</h2>
      <p className="text-sm text-admin-muted">
        Cadastre os jogos da fase de grupos e do mata-mata para lançar os placares por aqui.
      </p>
      {newMatchHref ? (
        <Link href={newMatchHref} className={ACTION_CLASS}>
          Nova partida
        </Link>
      ) : null}
    </section>
  );
}
