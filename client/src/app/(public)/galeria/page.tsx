import type { Metadata } from 'next';
import { AlbumSectionSkeleton } from '@/features/gallery/components/GallerySkeletons';
import { Suspense, type ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { GalleryIndexLoader } from '@/features/gallery/components/GalleryIndexLoader';

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Fotos da JOCEV’S 2026 e dos eventos da festividade.',
};

export default function GalleryRoute(): ReactElement {
  return (
    <>
      <PageHero
        eyebrow="JOCEV’S 2026"
        title="Galeria"
        description="Os melhores momentos da festividade."
      />
      <Suspense fallback={<AlbumSectionSkeleton />}>
        <GalleryIndexLoader />
      </Suspense>
    </>
  );
}
