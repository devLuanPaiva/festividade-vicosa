import type { Metadata } from 'next';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';
import { AlbumCardsSkeleton } from '@/features/gallery/components/GallerySkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventAlbumsLoader } from '@/features/gallery/components/SubEventAlbumsLoader';

export const metadata: Metadata = {
  title: 'Galeria do evento',
  description: 'Álbuns de fotos do evento, por dia.',
};

interface SubEventAlbumsRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function SubEventAlbumsRoute({ params }: SubEventAlbumsRouteProps): ReactElement {
  return (
    <Suspense
      fallback={
        <PublicPageSkeleton label="Carregando os álbuns">
          <AlbumCardsSkeleton />
        </PublicPageSkeleton>
      }
    >
      <SubEventAlbumsLoader params={params} />
    </Suspense>
  );
}
