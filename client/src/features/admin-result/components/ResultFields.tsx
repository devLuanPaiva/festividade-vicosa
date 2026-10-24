import type { ReactElement } from 'react';
import type { MatchDetail } from '@/features/games/services/get-match-detail';
import type { FormErrorState } from '@/lib/forms/form-errors';
import type { ResultDraft, ResultDraftChange } from '../types';
import { BestPlayerFields } from './BestPlayerFields';
import { PlayedFields } from './PlayedFields';
import { TeamChoice } from './TeamChoice';

interface ResultFieldsProps {
  detail: MatchDetail;
  draft: ResultDraft;
  formError: FormErrorState;
  onChange: ResultDraftChange;
}

export function ResultFields({
  detail,
  draft,
  formError,
  onChange,
}: ResultFieldsProps): ReactElement | null {
  const { match, teamA, teamB } = detail;
  if (draft.resultType === 'WALKOVER') {
    return (
      <TeamChoice
        legend="Qual time compareceu?"
        name="walkoverWinnerId"
        teams={[teamA, teamB]}
        value={draft.walkoverWinnerId}
        onChange={(teamId) => onChange('walkoverWinnerId', teamId)}
      />
    );
  }
  if (draft.resultType === 'DOUBLE_WALKOVER') {
    return null;
  }
  return (
    <>
      <PlayedFields
        stage={match.stage}
        teamA={teamA}
        teamB={teamB}
        draft={draft}
        formError={formError}
        onChange={onChange}
      />
      <BestPlayerFields
        match={match}
        teams={[teamA, teamB]}
        draft={draft}
        nameError={formError.errorField === 'bestPlayerName' ? formError.errorMessage : null}
        onChange={onChange}
      />
    </>
  );
}
