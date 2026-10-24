import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { INITIAL_TEAM_STATE, type TeamFormState, type TeamFormValues } from '../types';

const TEAM_FIELDS = ['name', 'city', 'abbreviation', 'groupId'];

type TeamAction = (previous: TeamFormState, formData: FormData) => Promise<TeamFormState>;

interface TeamFormControls {
  state: TeamFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

export function useTeamForm(action: TeamAction, initialValues: TeamFormValues): TeamFormControls {
  const [state, formAction] = useActionState(action, {
    ...INITIAL_TEAM_STATE,
    values: initialValues,
  });
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return { state, formAction, errorFor, touch, otherError: generalError(state, TEAM_FIELDS) };
}
