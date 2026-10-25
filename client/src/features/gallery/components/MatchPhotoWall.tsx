import type { ReactElement } from 'react';
import type { GalleryImage } from '../types';
import { PhotoGallery } from './PhotoGallery';

interface MatchPhotoWallProps {
  images: GalleryImage[];
}

export function MatchPhotoWall({ images }: MatchPhotoWallProps): ReactElement | null {
  if (images.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="match-photos-title" className="flex flex-col gap-4">
      <h2 id="match-photos-title" className="font-display text-4xl text-brand-900">
        Fotos da partida
      </h2>
      <PhotoGallery images={images} />
    </section>
  );
}
