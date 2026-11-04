'use client';

import type { ReactElement } from 'react';
import { FormFooter } from '@/components/ui/FormFooter';
import { TextField } from '@/components/ui/TextField';
import { useLiveForm } from '../hooks/use-live-form';
import type { LiveFormState, LiveFormValues } from '../types';

const MAX_TITLE_LENGTH = 120;
const MAX_URL_LENGTH = 300;

interface LiveFormProps {
  action: (previous: LiveFormState, formData: FormData) => Promise<LiveFormState>;
  initialValues: LiveFormValues;
  cancelHref: string;
  submitLabel: string;
}

export function LiveForm({
  action,
  initialValues,
  cancelHref,
  submitLabel,
}: LiveFormProps): ReactElement {
  const { state, formAction, errorFor, touch, otherError } = useLiveForm(action, initialValues);
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        name="title"
        label="Título da transmissão"
        defaultValue={state.values.title}
        errorMessage={errorFor('title')}
        maxLength={MAX_TITLE_LENGTH}
        onInput={touch('title')}
      />
      <TextField
        name="url"
        label="Link do YouTube (pode ser não listado)"
        defaultValue={state.values.url}
        errorMessage={errorFor('url')}
        maxLength={MAX_URL_LENGTH}
        onInput={touch('url')}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="date"
          type="date"
          label="Dia do início"
          defaultValue={state.values.date}
          errorMessage={errorFor('startsAt')}
          onInput={touch('startsAt')}
        />
        <TextField
          name="time"
          type="time"
          label="Hora do início"
          defaultValue={state.values.time}
          errorMessage={null}
          onInput={touch('startsAt')}
        />
      </div>
      {otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {otherError}
        </p>
      ) : null}
      <FormFooter cancelHref={cancelHref} submitLabel={submitLabel} />
    </form>
  );
}
