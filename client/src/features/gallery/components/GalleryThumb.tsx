'use client';

import Image from 'next/image';
import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { GalleryImage } from '../types';

const THUMBNAIL_SIZE = 320;
const SELECTED_MARK_CLASS = 'border-sun bg-sun text-brand-900';
const UNSELECTED_MARK_CLASS = 'border-white bg-black/30 text-transparent';

interface GalleryThumbProps {
  image: GalleryImage;
  position: number;
  total: number;
  isSelecting: boolean;
  isSelected: boolean;
  onActivate: () => void;
}

function labelFor({ isSelecting, isSelected, position, total }: GalleryThumbProps): string {
  const photo = `a foto ${position} de ${total}`;
  if (!isSelecting) {
    return `Abrir ${photo}`;
  }
  return `${isSelected ? 'Desmarcar' : 'Selecionar'} ${photo}`;
}

function SelectionMark({ isSelected }: { isSelected: boolean }): ReactElement {
  const tone = isSelected ? SELECTED_MARK_CLASS : UNSELECTED_MARK_CLASS;
  return (
    <span
      aria-hidden="true"
      className={`absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full border-2 ${tone}`}
    >
      <Icon name="check" className="size-5" />
    </span>
  );
}

export function GalleryThumb(props: GalleryThumbProps): ReactElement {
  const { image, isSelecting, isSelected, onActivate } = props;
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={labelFor(props)}
      aria-pressed={isSelecting ? isSelected : undefined}
      className={`relative block w-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(7,59,134,0.12)] transition-all duration-300 hover:-translate-y-1 ${isSelected ? 'ring-4 ring-sun' : ''}`}
    >
      <Image
        src={image.thumbUrl}
        alt=""
        width={THUMBNAIL_SIZE}
        height={THUMBNAIL_SIZE}
        unoptimized
        loading="lazy"
        className="aspect-square w-full object-cover"
      />
      {isSelecting ? <SelectionMark isSelected={isSelected} /> : null}
    </button>
  );
}
