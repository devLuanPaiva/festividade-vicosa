import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { suggestBracketAction } from '../actions/bracket-actions';
import {
  BRACKET_ERROR_FIELD,
  initialBracketState,
  type BracketFormState,
  type SeededTeam,
} from '../types';

const BRACKET_FIELDS = [BRACKET_ERROR_FIELD];

export interface BracketFormControls {
  state: BracketFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

export function useBracketForm(categoryId: string, seeding: SeededTeam[]): BracketFormControls {
  const [state, formAction] = useActionState(
    suggestBracketAction.bind(null, categoryId),
    initialBracketState(seeding),
  );
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty && state.rows === null);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return { state, formAction, errorFor, touch, otherError: generalError(state, BRACKET_FIELDS) };
}
