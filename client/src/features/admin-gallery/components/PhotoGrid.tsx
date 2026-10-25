'use client';

import Image from 'next/image';
import { startTransition, useActionState, type ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { movePhoto } from '../lib/move-photo';

const THUMBNAIL_SIZE = 320;
const MOVE_BUTTON_CLASS =
  'inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-admin-line bg-admin-surface text-sm font-semibold transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

export interface GridPhoto {
  id: string;
  url: string;
}

interface PhotoGridProps {
  photos: GridPhoto[];
  canManage: boolean;
  reorderAction: (photoIds: string[]) => Promise<FormErrorState>;
  deleteAction: (photoId: string) => Promise<FormErrorState>;
}

interface PhotoCardProps {
  photo: GridPhoto;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  isBusy: boolean;
  onMove: (offset: number) => void;
  deleteAction: PhotoGridProps['deleteAction'];
}

function PhotoCard({
  photo,
  position,
  isFirst,
  isLast,
  isBusy,
  onMove,
  deleteAction,
}: PhotoCardProps): ReactElement {
  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-admin-line bg-admin-surface p-2">
      <Image
        src={photo.url}
        alt={`Foto ${position}`}
        width={THUMBNAIL_SIZE}
        height={THUMBNAIL_SIZE}
        unoptimized
        className="aspect-square w-full rounded-xl bg-admin-canvas object-cover"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isFirst || isBusy}
          onClick={() => onMove(-1)}
          className={MOVE_BUTTON_CLASS}
        >
          ‹ Antes
        </button>
        <button
          type="button"
          disabled={isLast || isBusy}
          onClick={() => onMove(1)}
          className={MOVE_BUTTON_CLASS}
        >
          Depois ›
        </button>
      </div>
      <ConfirmDeleteDialog
        triggerLabel="Excluir foto"
        title={`Excluir a foto ${position}?`}
        description="A foto some da galeria e os arquivos são apagados. Esta ação não pode ser desfeita."
        confirmLabel="Excluir foto"
        action={() => deleteAction(photo.id)}
      />
    </li>
  );
}

export function PhotoGrid({
  photos,
  canManage,
  reorderAction,
  deleteAction,
}: PhotoGridProps): ReactElement {
  const [state, reorder, isBusy] = useActionState(
    (_previous: FormErrorState, photoIds: string[]) => reorderAction(photoIds),
    INITIAL_FORM_ERROR_STATE,
  );
  const ids = photos.map((photo) => photo.id);

  if (photos.length === 0) {
    return <p className="text-sm text-admin-muted">Este álbum ainda não tem fotos.</p>;
  }
  return (
    <section aria-label="Fotos do álbum" className="flex flex-col gap-3">
      {state.errorMessage ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {state.errorMessage}
        </p>
      ) : null}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) =>
          canManage ? (
            <PhotoCard
              key={photo.id}
              photo={photo}
              position={index + 1}
              isFirst={index === 0}
              isLast={index === photos.length - 1}
              isBusy={isBusy}
              onMove={(offset) => startTransition(() => reorder(movePhoto(ids, index, offset)))}
              deleteAction={deleteAction}
            />
          ) : (
            <li key={photo.id}>
              <Image
                src={photo.url}
                alt={`Foto ${index + 1}`}
                width={THUMBNAIL_SIZE}
                height={THUMBNAIL_SIZE}
                unoptimized
                className="aspect-square w-full rounded-xl bg-admin-canvas object-cover"
              />
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
