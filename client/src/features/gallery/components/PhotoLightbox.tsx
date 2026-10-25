'use client';

import Image from 'next/image';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useDialogVisibility } from '../hooks/use-dialog-visibility';
import { stepIndex } from '../lib/step-index';
import type { GalleryImage } from '../types';
import { LightboxControls } from './LightboxControls';

const ARROW_OFFSETS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

interface PhotoLightboxProps {
  images: GalleryImage[];
  openIndex: number | null;
  onChange: (index: number | null) => void;
}

export function PhotoLightbox({ images, openIndex, onChange }: PhotoLightboxProps): ReactElement {
  const image = openIndex === null ? undefined : images[openIndex];
  const dialogRef = useDialogVisibility(image !== undefined);

  const step = (offset: number): void => {
    if (openIndex !== null) {
      onChange(stepIndex(openIndex, offset, images.length));
    }
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    step(ARROW_OFFSETS[event.key] ?? 0);
  };
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) {
      onChange(null);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Visualizador de fotos"
      onClose={() => onChange(null)}
      onKeyDown={handleKeyDown}
      onClick={closeOnBackdrop}
      className="m-0 size-full max-h-none max-w-none bg-black/90 p-0 backdrop:bg-black/90"
    >
      {image ? (
        <div className="relative flex size-full items-center justify-center p-4">
          <Image
            src={image.largeUrl}
            alt={`Foto ${(openIndex ?? 0) + 1} de ${images.length}`}
            width={1600}
            height={1200}
            unoptimized
            className="max-h-full w-auto max-w-full object-contain"
          />
          <LightboxControls onStep={step} onClose={() => onChange(null)} />
        </div>
      ) : null}
    </dialog>
  );
}
