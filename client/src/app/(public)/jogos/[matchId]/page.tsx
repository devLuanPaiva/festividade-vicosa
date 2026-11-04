import type { Metadata } from 'next';
import { MatchDetailSkeleton } from '@/components/loading/MatchDetailSkeleton';
import { Suspense, type ReactElement } from 'react';
import { MatchDetailLoader } from '@/features/games/components/MatchDetailLoader';
import { getMatchMetadata } from '@/features/games/services/get-match-metadata';

interface MatchRouteProps {
  params: Promise<{ matchId: string }>;
}

export async function generateMetadata({ params }: MatchRouteProps): Promise<Metadata> {
  const { matchId } = await params;
  return getMatchMetadata(matchId);
}

export default function MatchRoute({ params }: MatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<MatchDetailSkeleton />}>
      <MatchDetailLoader params={params} />
    </Suspense>
  );
}
