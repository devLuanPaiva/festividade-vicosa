import type { ReactElement } from 'react';
import { BracketNotice } from '@/features/admin-bracket/components/BracketNotice';
import { categoryMatchesPath } from '@/features/admin-matches/lib/admin-match-paths';
import { categoryTabPath } from '@/features/admin-teams/lib/admin-team-paths';
import type { SelectOption } from '@/components/ui/SelectField';
import { toBracketRows } from '../lib/suggestion-rows';
import { getNextMatchSuggestions } from '../services/get-suggestions';
import { SuggestionReviewForm } from './SuggestionReviewForm';

interface NextMatchesSuggestionProps {
  categoryId: string;
  teamOptions: SelectOption[];
}

export async function NextMatchesSuggestion({
  categoryId,
  teamOptions,
}: NextMatchesSuggestionProps): Promise<ReactElement> {
  const suggestions = await getNextMatchSuggestions(categoryId);
  if (suggestions.length === 0) {
    return (
      <BracketNotice
        title="Nenhuma partida nova para sugerir"
        text="O chaveamento já foi criado. Quando duas partidas que se encontram forem finalizadas, a próxima rodada aparece aqui para você confirmar."
        href={categoryMatchesPath(categoryId)}
        linkLabel="Ver partidas"
      />
    );
  }
  return (
    <SuggestionReviewForm
      target={{ categoryId, returnPath: categoryTabPath(categoryId, 'chaveamento') }}
      rows={toBracketRows(suggestions)}
      teamOptions={teamOptions}
      submitLabel="Confirmar partidas marcadas"
    />
  );
}
