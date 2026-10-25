import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { confirmSuggestionsAction } from '../actions/suggestion-actions';
import { rowFieldName } from '../lib/parse-suggestion-form';
import {
  ROWS_ERROR_FIELD,
  initialSuggestionState,
  type SuggestionFormState,
  type SuggestionRow,
  type SuggestionTarget,
} from '../types';

export interface SuggestionFormControls {
  state: SuggestionFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

function knownFields(rowCount: number): string[] {
  const rowFields = Array.from({ length: rowCount }, (_, index) =>
    ['date', 'time', 'location', 'teamAId', 'teamBId'].map((field) => rowFieldName(index, field)),
  ).flat();
  return [ROWS_ERROR_FIELD, ...rowFields];
}

export function useSuggestionForm(
  target: SuggestionTarget,
  rows: SuggestionRow[],
): SuggestionFormControls {
  const [state, formAction] = useActionState(
    confirmSuggestionsAction.bind(null, target),
    initialSuggestionState(rows),
  );
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return {
    state,
    formAction,
    errorFor,
    touch,
    otherError: generalError(state, knownFields(state.values.rows.length)),
  };
}
