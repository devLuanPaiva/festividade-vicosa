import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { MatchAlbumLoader } from '@/features/admin-gallery/components/MatchAlbumLoader';

export const metadata: Metadata = { title: 'Fotos da partida' };

interface MatchPhotosRouteProps {
  params: Promise<{ matchId: string }>;
}

export default function MatchPhotosRoute({ params }: MatchPhotosRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando as fotos…</p>}>
      <MatchAlbumLoader params={params} />
    </Suspense>
  );
}
