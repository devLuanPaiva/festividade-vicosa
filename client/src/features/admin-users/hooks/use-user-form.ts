import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import type { UserFormState, UserFormValues } from '../types';

const USER_FIELDS = ['name', 'email', 'password', 'roleId'];

type UserAction = (previous: UserFormState, formData: FormData) => Promise<UserFormState>;

export interface UserFormControls {
  state: UserFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

export function useUserForm(action: UserAction, initialValues: UserFormValues): UserFormControls {
  const [state, formAction] = useActionState(action, {
    errorMessage: null,
    errorField: null,
    values: initialValues,
    isSaved: false,
  });
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return { state, formAction, errorFor, touch, otherError: generalError(state, USER_FIELDS) };
}
