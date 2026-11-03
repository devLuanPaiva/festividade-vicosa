import type { Metadata } from 'next';
import { MatchDetailSkeleton } from '@/components/loading/MatchDetailSkeleton';
import { Suspense, type ReactElement } from 'react';
import { MatchDetailLoader } from '@/features/games/components/MatchDetailLoader';
import { getMatchMetadata } from '@/features/games/services/get-match-metadata';
import { readSharedPhotoId } from '@/lib/share/share-links';

interface MatchRouteProps {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: MatchRouteProps): Promise<Metadata> {
  const { matchId } = await params;
  return getMatchMetadata(matchId, readSharedPhotoId((await searchParams).foto));
}

export default function MatchRoute({ params, searchParams }: MatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<MatchDetailSkeleton />}>
      <MatchDetailLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
