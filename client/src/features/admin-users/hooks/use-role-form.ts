import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import type { RoleFormState, RoleFormValues } from '../types';

const ROLE_FIELDS = ['name'];

type RoleAction = (previous: RoleFormState, formData: FormData) => Promise<RoleFormState>;

export interface RoleFormControls {
  state: RoleFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

export function useRoleForm(action: RoleAction, initialValues: RoleFormValues): RoleFormControls {
  const [state, formAction] = useActionState(action, {
    errorMessage: null,
    errorField: null,
    values: initialValues,
    isSaved: false,
  });
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty && !state.isSaved);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return { state, formAction, errorFor, touch, otherError: generalError(state, ROLE_FIELDS) };
}
