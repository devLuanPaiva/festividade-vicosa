import type { ReactElement } from 'react';
import { categoryMatchesPath } from '@/features/admin-matches/lib/admin-match-paths';
import { categoryTabPath } from '@/features/admin-teams/lib/admin-team-paths';
import type { Match } from '@/features/games/types';
import { hasGeneratedBracket } from '../lib/has-generated-bracket';
import { getCategorySeeding } from '../services/get-category-seeding';
import { BracketForm } from './BracketForm';
import { BracketNotice } from './BracketNotice';

interface BracketTabProps {
  categoryId: string;
  matches: Match[];
}

export async function BracketTab({ categoryId, matches }: BracketTabProps): Promise<ReactElement> {
  if (hasGeneratedBracket(matches)) {
    return (
      <BracketNotice
        title="O chaveamento já foi gerado"
        text="Ajuste datas e locais na aba Partidas. Os vencedores avançam sozinhos quando os resultados são lançados."
        href={categoryMatchesPath(categoryId)}
        linkLabel="Ver partidas"
      />
    );
  }
  const seeding = await getCategorySeeding(categoryId);
  if (seeding.length === 0) {
    return (
      <BracketNotice
        title="Nenhum classificado confirmado"
        text="Confirme os classificados de cada grupo antes de gerar o chaveamento."
        href={categoryTabPath(categoryId, 'classificados')}
        linkLabel="Confirmar classificados"
      />
    );
  }
  return (
    <BracketForm
      categoryId={categoryId}
      seeding={seeding}
      cancelHref={categoryMatchesPath(categoryId)}
    />
  );
}
