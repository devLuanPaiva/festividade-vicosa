import type { ReactElement } from 'react';
import type { MatchStage, Team } from '@/features/games/types';
import { errorForField, type FormErrorState } from '@/lib/forms/form-errors';
import { needsPenalties } from '../lib/result-draft';
import type { ResultDraft, ResultDraftChange } from '../types';
import { ScoreInput } from './ScoreInput';

interface PlayedFieldsProps {
  stage: MatchStage;
  teamA: Team;
  teamB: Team;
  draft: ResultDraft;
  formError: FormErrorState;
  onChange: ResultDraftChange;
}

export function PlayedFields({
  stage,
  teamA,
  teamB,
  draft,
  formError,
  onChange,
}: PlayedFieldsProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <ScoreInput
          name="scoreA"
          label={teamA.name}
          value={draft.scoreA}
          errorMessage={errorForField(formError, 'scoreA')}
          onChange={(value) => onChange('scoreA', value)}
        />
        <span aria-hidden="true" className="mt-12 text-xl font-bold text-admin-muted">
          x
        </span>
        <ScoreInput
          name="scoreB"
          label={teamB.name}
          value={draft.scoreB}
          errorMessage={errorForField(formError, 'scoreB')}
          onChange={(value) => onChange('scoreB', value)}
        />
      </div>
      {needsPenalties(stage, draft) ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-sun bg-sun/15 p-4">
          <p className="text-sm font-semibold">Empate no mata-mata: informe os pênaltis.</p>
          <div className="flex items-start gap-3">
            <ScoreInput
              name="penaltiesA"
              label={teamA.name}
              value={draft.penaltiesA}
              errorMessage={errorForField(formError, 'penaltiesA')}
              onChange={(value) => onChange('penaltiesA', value)}
            />
            <ScoreInput
              name="penaltiesB"
              label={teamB.name}
              value={draft.penaltiesB}
              errorMessage={errorForField(formError, 'penaltiesB')}
              onChange={(value) => onChange('penaltiesB', value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
