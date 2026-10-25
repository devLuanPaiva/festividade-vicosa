'use client';

import Image from 'next/image';
import { useState, type ReactElement } from 'react';
import type { GalleryImage } from '../types';
import { PhotoLightbox } from './PhotoLightbox';

const THUMBNAIL_SIZE = 320;

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export function PhotoGallery({ images }: PhotoGalleryProps): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Abrir a foto ${index + 1} de ${images.length}`}
              className="block w-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(7,59,134,0.12)] transition-transform duration-300 hover:-translate-y-1"
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
            </button>
          </li>
        ))}
      </ul>
      <PhotoLightbox images={images} openIndex={openIndex} onChange={setOpenIndex} />
    </>
  );
}
