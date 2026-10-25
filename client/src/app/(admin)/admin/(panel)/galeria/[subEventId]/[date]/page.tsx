import type { Metadata } from 'next';
import { AdminAlbumSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { AlbumLoader } from '@/features/admin-gallery/components/AlbumLoader';

export const metadata: Metadata = { title: 'Álbum do dia' };

interface AlbumRouteProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export default function AlbumRoute({ params }: AlbumRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminAlbumSkeleton label="Carregando o álbum" />}>
      <AlbumLoader params={params} />
    </Suspense>
  );
}
