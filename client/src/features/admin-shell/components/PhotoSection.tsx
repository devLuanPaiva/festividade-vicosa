'use client';

import Image from 'next/image';
import { useActionState, useRef, useState, type ReactElement } from 'react';
import { FieldError } from '@/components/ui/field-control';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { usePhotoUpload } from '../hooks/use-photo-upload';
import { ImageDropZone } from './ImageDropZone';

const PHOTO_FIELD = 'file';
const PREVIEW_SIZE = 256;

interface PhotoSectionProps {
  title: string;
  alt: string;
  photoUrl: string | null;
  uploadAction: (previous: FormErrorState, formData: FormData) => Promise<FormErrorState>;
  removeAction: (previous: FormErrorState) => Promise<FormErrorState>;
}

interface PickedPhoto {
  name: string;
  previewUrl: string;
}

function PhotoPreview({
  alt,
  photoUrl,
  isNew,
}: {
  alt: string;
  photoUrl: string | null;
  isNew: boolean;
}): ReactElement {
  return (
    <div className="relative aspect-square w-full overflow-hidden sm:max-w-64 rounded-2xl border border-admin-line bg-admin-canvas">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={alt}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          unoptimized={isNew}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-sm text-admin-muted">
          Sem foto
        </span>
      )}
      {isNew ? (
        <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
          Nova foto
        </span>
      ) : null}
    </div>
  );
}

function RemovePhotoForm({ action }: { action: PhotoSectionProps['removeAction'] }): ReactElement {
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
  picked,
  onPick,
}: {
  action: PhotoSectionProps['uploadAction'];
  picked: PickedPhoto | null;
  onPick: (file: File) => void;
}): ReactElement {
  const { state, formAction } = usePhotoUpload(action);
  const fieldError = state.errorField === PHOTO_FIELD ? state.errorMessage : null;
  const generalMessage = fieldError ? null : state.errorMessage;
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <ImageDropZone
        id={PHOTO_FIELD}
        name={PHOTO_FIELD}
        required
        title={picked ? picked.name : 'Arraste a foto até aqui'}
        hint="JPG, PNG ou WebP. Ela é reduzida no aparelho antes de enviar."
        invalidMessageId={fieldError ? `${PHOTO_FIELD}-error` : undefined}
        onFiles={([file]) => file && onPick(file)}
      />
      <FieldError name={PHOTO_FIELD} message={fieldError} />
      {generalMessage ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {generalMessage}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Enviando…" disabled={!picked} className="min-h-12 px-6">
        Enviar foto
      </SubmitButton>
    </form>
  );
}

function PhotoEditor({
  alt,
  photoUrl,
  uploadAction,
  removeAction,
}: Readonly<Omit<PhotoSectionProps, 'title'>>): ReactElement {
  const [picked, setPicked] = useState<PickedPhoto | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const pick = (file: File): void => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = URL.createObjectURL(file);
    setPicked({ name: file.name, previewUrl: previewUrlRef.current });
  };

  return (
    <div className="grid items-start gap-5 sm:grid-cols-[16rem_1fr]">
      <PhotoPreview alt={alt} photoUrl={picked?.previewUrl ?? photoUrl} isNew={picked !== null} />
      <div className="flex flex-col gap-3">
        <UploadPhotoForm action={uploadAction} picked={picked} onPick={pick} />
        {photoUrl ? <RemovePhotoForm action={removeAction} /> : null}
      </div>
    </div>
  );
}

export function PhotoSection({ title, ...editor }: Readonly<PhotoSectionProps>): ReactElement {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-4 rounded-2xl border border-admin-line bg-admin-surface p-4 sm:p-5"
    >
      <h2 className="font-bold">{title}</h2>
      <PhotoEditor key={editor.photoUrl ?? 'no-photo'} {...editor} />
    </section>
  );
}
