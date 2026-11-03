import type { ReactElement } from 'react';
import type { UploadItem, UploadStatus } from '../types';

const STATUS_LABELS: Record<UploadStatus, string> = {
  waiting: 'Na fila',
  uploading: 'Enviando…',
  done: 'Enviada',
  failed: 'Falhou',
};

const STATUS_CLASSES: Record<UploadStatus, string> = {
  waiting: 'text-admin-muted',
  uploading: 'text-brand-700',
  done: 'text-success',
  failed: 'text-danger',
};

interface UploadQueueListProps {
  items: UploadItem[];
}

export function UploadQueueList({ items }: UploadQueueListProps): ReactElement | null {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul
      aria-live="polite"
      className="flex flex-col divide-y divide-admin-line rounded-xl border border-admin-line bg-admin-surface"
    >
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-1 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate font-semibold">{item.name}</span>
            <span className={`shrink-0 font-semibold ${STATUS_CLASSES[item.status]}`}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>
          {item.message ? (
            <p role="alert" className="text-danger">
              {item.message}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
