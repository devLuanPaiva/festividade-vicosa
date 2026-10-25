import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { GalleryIndexLoader } from '@/features/gallery/components/GalleryIndexLoader';

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Fotos da JOCEV’S 2026 e dos eventos da festividade, por dia.',
};

export default function GalleryRoute(): ReactElement {
  return (
    <>
      <PageHero
        eyebrow="JOCEV’S 2026"
        title="Galeria"
        description="Os melhores momentos da festividade, dia a dia."
      />
      <Suspense fallback={<div className="surface-paper min-h-64" />}>
        <GalleryIndexLoader />
      </Suspense>
    </>
  );
}
