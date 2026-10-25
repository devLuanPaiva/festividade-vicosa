import type { Metadata } from 'next';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';
import { DayPhotosSkeleton } from '@/features/gallery/components/GallerySkeletons';
import { Suspense, type ReactElement } from 'react';
import { DayAlbumLoader } from '@/features/gallery/components/DayAlbumLoader';

export const metadata: Metadata = {
  title: 'Álbum do dia',
  description: 'Fotos do dia na festividade de Viçosa.',
};

interface DayAlbumRouteProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export default function DayAlbumRoute({ params }: DayAlbumRouteProps): ReactElement {
  return (
    <Suspense
      fallback={
        <PublicPageSkeleton label="Carregando as fotos">
          <DayPhotosSkeleton />
        </PublicPageSkeleton>
      }
    >
      <DayAlbumLoader params={params} />
    </Suspense>
  );
}
