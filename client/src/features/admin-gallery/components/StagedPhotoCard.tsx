'use client';

import Image from 'next/image';
import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useThumbnailUrl } from '../hooks/use-thumbnail-url';
import { formatFileSize } from '../lib/select-photos';
import type { StagedPhoto, StagedStatus } from '../types';

const PREVIEW_SIZE = 240;

const STATUS_LABELS: Record<StagedStatus, string | null> = {
  staged: null,
  waiting: 'Na fila',
  uploading: 'Enviando…',
  done: 'Enviada',
  failed: 'Falhou',
};

interface StagedPhotoCardProps {
  item: StagedPhoto;
  isSending: boolean;
  onRemove: () => void;
}

function StatusBadge({ status }: { status: StagedStatus }): ReactElement | null {
  const label = STATUS_LABELS[status];
  if (!label) {
    return null;
  }
  const tone = status === 'failed' ? 'bg-danger text-white' : 'bg-black/65 text-white';
  return (
    <span
      className={`absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${tone}`}
    >
      {status === 'uploading' ? (
        <span className="size-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {status === 'done' ? <Icon name="check" className="size-3.5" /> : null}
      {label}
    </span>
  );
}

export function StagedPhotoCard({ item, isSending, onRemove }: StagedPhotoCardProps): ReactElement {
  const previewUrl = useThumbnailUrl(item.file);
  const isBusy = item.status === 'uploading' || item.status === 'waiting';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative overflow-hidden rounded-xl bg-admin-canvas">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`Prévia de ${item.file.name}`}
            width={PREVIEW_SIZE}
            height={PREVIEW_SIZE}
            unoptimized
            className={`aspect-square w-full object-cover transition-opacity ${isBusy ? 'opacity-60' : ''}`}
          />
        ) : (
          <div className="aspect-square w-full animate-pulse" />
        )}
        <StatusBadge status={item.status} />
        <button
          type="button"
          onClick={onRemove}
          disabled={isSending}
          aria-label={`Remover ${item.file.name}`}
          className="absolute right-1.5 top-1.5 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-danger disabled:pointer-events-none disabled:opacity-0"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
      <p className="truncate text-xs font-semibold text-admin-ink">{item.file.name}</p>
      <p className={`text-xs ${item.message ? 'text-danger' : 'text-admin-muted'}`}>
        {item.message ?? formatFileSize(item.file.size)}
      </p>
    </div>
  );
}
