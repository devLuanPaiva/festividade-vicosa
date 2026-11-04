import type { Metadata } from 'next';
import { AdminAlbumSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventGalleryLoader } from '@/features/admin-gallery/components/SubEventGalleryLoader';

export const metadata: Metadata = { title: 'Galeria do evento' };

interface SubEventGalleryRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function SubEventGalleryRoute({ params }: SubEventGalleryRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminAlbumSkeleton label="Carregando a galeria" />}>
      <SubEventGalleryLoader params={params} />
    </Suspense>
  );
}
