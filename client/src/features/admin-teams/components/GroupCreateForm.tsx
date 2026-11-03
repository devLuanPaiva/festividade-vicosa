'use client';

import { useActionState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { createGroupAction } from '../actions/group-actions';
import { INITIAL_GROUP_STATE } from '../types';

interface GroupCreateFormProps {
  categoryId: string;
}

const NAME_FIELD = 'name';

export function GroupCreateForm({ categoryId }: GroupCreateFormProps): ReactElement {
  const [state, formAction] = useActionState(
    createGroupAction.bind(null, categoryId),
    INITIAL_GROUP_STATE,
  );
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const nameError = errorFor(NAME_FIELD);
  const otherError = generalError(state, [NAME_FIELD]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
          Nome do novo grupo
          <input
            name={NAME_FIELD}
            defaultValue={state.name}
            onChange={() => dismiss(NAME_FIELD)}
            maxLength={120}
            autoComplete="off"
            required
            aria-invalid={nameError ? true : undefined}
            className="min-h-12 rounded-xl border border-admin-line bg-white px-4 text-base font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
          {nameError ? (
            <span role="alert" className="font-normal text-danger">
              {nameError}
            </span>
          ) : null}
        </label>
        <div className="sm:pt-7">
          <SubmitButton pendingLabel="Adicionando…">Adicionar grupo</SubmitButton>
        </div>
      </div>
      {otherError ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          {otherError}
        </p>
      ) : null}
    </form>
  );
}
