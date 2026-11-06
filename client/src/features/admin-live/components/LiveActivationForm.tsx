'use client';

import { useActionState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';

interface LiveActivationFormProps {
  action: (previous: FormErrorState) => Promise<FormErrorState>;
  isActive: boolean;
}

export function LiveActivationForm({
  action,
  isActive,
}: Readonly<LiveActivationFormProps>): ReactElement {
  const [state, formAction] = useActionState(action, INITIAL_FORM_ERROR_STATE);
  return (
    <form action={formAction} className="flex flex-col gap-1">
      <SubmitButton
        variant={isActive ? 'secondary' : 'primary'}
        pendingLabel="Salvando…"
        className="min-h-11 px-5"
      >
        {isActive ? 'Desligar da home' : 'Ligar na home'}
      </SubmitButton>
      {state.errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {state.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
