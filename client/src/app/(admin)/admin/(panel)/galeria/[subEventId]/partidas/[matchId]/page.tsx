import type { Metadata } from 'next';
import { AdminAlbumSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { MatchMediaLoader } from '@/features/admin-gallery/components/matches/MatchMediaLoader';

export const metadata: Metadata = { title: 'Fotos da partida' };

interface MatchMediaRouteProps {
  params: Promise<{ subEventId: string; matchId: string }>;
}

export default function MatchMediaRoute({ params }: MatchMediaRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminAlbumSkeleton label="Carregando a partida" />}>
      <MatchMediaLoader params={params} />
    </Suspense>
  );
}
