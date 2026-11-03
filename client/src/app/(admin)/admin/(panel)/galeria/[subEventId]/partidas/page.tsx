import type { Metadata } from 'next';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventMatchesLoader } from '@/features/admin-gallery/components/matches/SubEventMatchesLoader';
import type { RawSearchParams } from '@/features/admin-matches/lib/match-list-query';

export const metadata: Metadata = { title: 'Galeria por partidas' };

interface MatchesRouteProps {
  params: Promise<{ subEventId: string }>;
  searchParams: Promise<RawSearchParams>;
}

export default function MatchesRoute({ params, searchParams }: MatchesRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminListSkeleton label="Carregando as partidas" />}>
      <SubEventMatchesLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
