'use client';

import type { ReactElement } from 'react';
import type { StagingSummary } from '../lib/staging-summary';

interface UploadActionBarProps {
  summary: StagingSummary;
  isSending: boolean;
  onSend: () => void;
  onClear: () => void;
}

function pluralizePhotos(count: number): string {
  return count === 1 ? '1 foto' : `${count} fotos`;
}

export function UploadActionBar({
  summary,
  isSending,
  onSend,
  onClear,
}: UploadActionBarProps): ReactElement {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-3 rounded-2xl border border-admin-line bg-admin-surface/95 p-3 shadow-lg backdrop-blur">
      {isSending ? (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={summary.percent}
          aria-label="Progresso do envio"
          className="h-2 overflow-hidden rounded-full bg-admin-line"
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <p aria-live="polite" className="mr-auto text-sm font-semibold">
          {isSending
            ? `Enviando ${summary.finished} de ${summary.total}…`
            : `${pluralizePhotos(summary.total)} para enviar`}
        </p>
        <button
          type="button"
          onClick={onClear}
          disabled={isSending}
          className="inline-flex min-h-12 items-center rounded-xl border border-admin-line px-5 font-semibold transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={isSending}
          aria-busy={isSending}
          className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Enviando…' : `Enviar ${pluralizePhotos(summary.total)}`}
        </button>
      </div>
    </div>
  );
}
