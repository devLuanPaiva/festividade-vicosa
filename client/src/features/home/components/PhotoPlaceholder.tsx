import type { ReactElement } from 'react';

interface PhotoPlaceholderProps {
  caption: string;
}

export function PhotoPlaceholder({ caption }: PhotoPlaceholderProps): ReactElement {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
      <div className="surface-sky flex aspect-[16/10] items-end p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-900">
          Foto em breve
        </span>
      </div>
      <figcaption className="px-4 py-3 text-sm text-white/80">{caption}</figcaption>
    </figure>
  );
}
