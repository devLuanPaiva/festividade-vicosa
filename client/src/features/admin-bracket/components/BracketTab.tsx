import type { ReactElement } from 'react';
import { NextMatchesSuggestion } from '@/features/admin-suggestions/components/NextMatchesSuggestion';
import { toTeamSelectOptions } from '@/features/admin-suggestions/lib/team-options';
import { categoryTabPath } from '@/features/admin-teams/lib/admin-team-paths';
import type { Match, Team } from '@/features/games/types';
import { hasGeneratedBracket } from '../lib/has-generated-bracket';
import { getCategorySeeding } from '../services/get-category-seeding';
import { BracketForm } from './BracketForm';
import { BracketNotice } from './BracketNotice';

interface BracketTabProps {
  categoryId: string;
  matches: Match[];
  teams: Team[];
}

export async function BracketTab({
  categoryId,
  matches,
  teams,
}: BracketTabProps): Promise<ReactElement> {
  const teamOptions = toTeamSelectOptions(teams);
  if (hasGeneratedBracket(matches)) {
    return <NextMatchesSuggestion categoryId={categoryId} teamOptions={teamOptions} />;
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
      teamOptions={teamOptions}
      returnPath={categoryTabPath(categoryId, 'chaveamento')}
    />
  );
}
