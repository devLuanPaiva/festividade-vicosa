'use client';

import { useActionState, type ReactElement } from 'react';
import type { MatchDetail } from '@/features/games/services/get-match-detail';
import { generalError } from '@/lib/forms/form-errors';
import { recordResultAction } from '../actions/record-result-action';
import { useResultDraft } from '../hooks/use-result-draft';
import { createResultDraft } from '../lib/result-draft';
import { INITIAL_RESULT_STATE } from '../types';
import { ResultFields } from './ResultFields';
import { ResultTypeSelector } from './ResultTypeSelector';
import { SubmitResultButton } from './SubmitResultButton';

const FIELDS_WITH_INPUT = ['scoreA', 'scoreB', 'penaltiesA', 'penaltiesB', 'bestPlayerName'];

interface ResultFormProps {
  detail: MatchDetail;
}

export function ResultForm({ detail }: ResultFormProps): ReactElement {
  const { match } = detail;
  const [state, formAction, isPending] = useActionState(
    recordResultAction.bind(null, match.id),
    INITIAL_RESULT_STATE,
  );
  const { draft, changeField } = useResultDraft(createResultDraft(match));
  const unassignedError = generalError(state, FIELDS_WITH_INPUT);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <ResultTypeSelector
        value={draft.resultType}
        onChange={(value) => changeField('resultType', value)}
      />
      <ResultFields detail={detail} draft={draft} formError={state} onChange={changeField} />
      {unassignedError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {unassignedError}
        </p>
      ) : null}
      <SubmitResultButton isPending={isPending} isCorrection={match.status === 'FINALIZED'} />
    </form>
  );
}
