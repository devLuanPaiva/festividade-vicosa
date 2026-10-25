import type { Metadata } from 'next';
import { AdminAlbumSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { MatchAlbumLoader } from '@/features/admin-gallery/components/MatchAlbumLoader';

export const metadata: Metadata = { title: 'Fotos da partida' };

interface MatchPhotosRouteProps {
  params: Promise<{ matchId: string }>;
}

export default function MatchPhotosRoute({ params }: MatchPhotosRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminAlbumSkeleton label="Carregando as fotos" />}>
      <MatchAlbumLoader params={params} />
    </Suspense>
  );
}
