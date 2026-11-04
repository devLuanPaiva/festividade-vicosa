import { useActionState, useState } from 'react';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { INITIAL_LIVE_STATE, type LiveFormState, type LiveFormValues } from '../types';

const LIVE_FIELDS = ['title', 'url', 'startsAt'];

type LiveAction = (previous: LiveFormState, formData: FormData) => Promise<LiveFormState>;

export interface LiveFormControls {
  state: LiveFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
}

export function useLiveForm(action: LiveAction, initialValues: LiveFormValues): LiveFormControls {
  const [state, formAction] = useActionState(action, {
    ...INITIAL_LIVE_STATE,
    values: initialValues,
  });
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  useWarnOnDirty(isDirty);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  return { state, formAction, errorFor, touch, otherError: generalError(state, LIVE_FIELDS) };
}
