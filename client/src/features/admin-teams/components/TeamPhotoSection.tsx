'use client';

import Image from 'next/image';
import { useActionState, type ReactElement } from 'react';
import { FieldError } from '@/components/ui/field-control';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { useTeamPhotoUpload } from '../hooks/use-team-photo-upload';

const PHOTO_FIELD = 'file';
const PREVIEW_SIZE = 128;

interface TeamPhotoSectionProps {
  teamName: string;
  photoUrl: string | null;
  uploadAction: (previous: FormErrorState, formData: FormData) => Promise<FormErrorState>;
  removeAction: (previous: FormErrorState) => Promise<FormErrorState>;
}

function PhotoPreview({
  teamName,
  photoUrl,
}: Pick<TeamPhotoSectionProps, 'teamName' | 'photoUrl'>): ReactElement {
  if (!photoUrl) {
    return (
      <div className="flex size-32 shrink-0 items-center justify-center rounded-2xl border border-dashed border-admin-line text-sm text-admin-muted">
        Sem foto
      </div>
    );
  }
  return (
    <Image
      src={photoUrl}
      alt={`Foto do time ${teamName}`}
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      className="size-32 shrink-0 rounded-2xl border border-admin-line bg-white object-cover"
    />
  );
}

function RemovePhotoForm({
  action,
}: {
  action: TeamPhotoSectionProps['removeAction'];
}): ReactElement {
  const [state, formAction] = useActionState(action, INITIAL_FORM_ERROR_STATE);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <SubmitButton variant="secondary" pendingLabel="Removendo…" className="min-h-12 px-6">
        Remover foto
      </SubmitButton>
      {state.errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {state.errorMessage}
        </p>
      ) : null}
    </form>
  );
}

function UploadPhotoForm({
  action,
}: {
  action: TeamPhotoSectionProps['uploadAction'];
}): ReactElement {
  const { state, formAction } = useTeamPhotoUpload(action);
  const fieldError = state.errorField === PHOTO_FIELD ? state.errorMessage : null;
  const generalMessage = fieldError ? null : state.errorMessage;
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor={PHOTO_FIELD} className="text-sm font-semibold">
        Escolher foto <span className="font-normal text-admin-muted">(JPG, PNG ou WebP)</span>
      </label>
      <input
        id={PHOTO_FIELD}
        name={PHOTO_FIELD}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={fieldError ? `${PHOTO_FIELD}-error` : undefined}
        className="min-h-12 w-full rounded-xl border border-admin-line bg-white p-2 text-base"
      />
      <FieldError name={PHOTO_FIELD} message={fieldError} />
      {generalMessage ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {generalMessage}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Enviando…" className="min-h-12 px-6">
        Enviar foto
      </SubmitButton>
    </form>
  );
}

export function TeamPhotoSection({
  teamName,
  photoUrl,
  uploadAction,
  removeAction,
}: TeamPhotoSectionProps): ReactElement {
  return (
    <section aria-labelledby="team-photo-title" className="flex flex-col gap-4">
      <h2 id="team-photo-title" className="font-bold">
        Foto do time
      </h2>
      <div className="flex flex-wrap items-start gap-5">
        <PhotoPreview teamName={teamName} photoUrl={photoUrl} />
        <div className="flex min-w-60 flex-1 flex-col gap-3">
          <UploadPhotoForm action={uploadAction} />
          {photoUrl ? <RemovePhotoForm action={removeAction} /> : null}
        </div>
      </div>
    </section>
  );
}
