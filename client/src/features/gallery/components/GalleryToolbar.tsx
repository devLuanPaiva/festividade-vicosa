'use client';

import type { ReactElement } from 'react';

const BUTTON_CLASS =
  'inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const PRIMARY_CLASS = `${BUTTON_CLASS} bg-brand-500 text-white hover:bg-brand-700`;
const SECONDARY_CLASS = `${BUTTON_CLASS} bg-white text-brand-900 ring-1 ring-brand-900/15 hover:ring-brand-500`;

interface GalleryToolbarProps {
  isSelecting: boolean;
  selectedCount: number;
  totalCount: number;
  isDownloading: boolean;
  onStartSelecting: () => void;
  onCancel: () => void;
  onSelectAll: () => void;
  onDownload: () => void;
}

export function GalleryToolbar({
  isSelecting,
  selectedCount,
  totalCount,
  isDownloading,
  onStartSelecting,
  onCancel,
  onSelectAll,
  onDownload,
}: GalleryToolbarProps): ReactElement {
  if (!isSelecting) {
    return (
      <div className="flex justify-end">
        <button type="button" onClick={onStartSelecting} className={SECONDARY_CLASS}>
          Selecionar para baixar
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_10px_30px_rgba(7,59,134,0.12)]">
      <p aria-live="polite" className="mr-auto text-sm font-semibold text-brand-900">
        {selectedCount === 0
          ? 'Toque nas fotos que quer baixar'
          : `${selectedCount} de ${totalCount} selecionadas`}
      </p>
      <button
        type="button"
        onClick={onSelectAll}
        disabled={isDownloading || selectedCount === totalCount}
        className={SECONDARY_CLASS}
      >
        Selecionar todas
      </button>
      <button type="button" onClick={onCancel} disabled={isDownloading} className={SECONDARY_CLASS}>
        Cancelar
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={isDownloading || selectedCount === 0}
        aria-busy={isDownloading}
        className={PRIMARY_CLASS}
      >
        {isDownloading ? 'Baixando…' : 'Baixar selecionadas'}
      </button>
    </div>
  );
}
