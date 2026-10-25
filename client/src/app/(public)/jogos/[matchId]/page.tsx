import type { Metadata } from 'next';
import { MatchDetailSkeleton } from '@/components/loading/MatchDetailSkeleton';
import { Suspense, type ReactElement } from 'react';
import { MatchDetailLoader } from '@/features/games/components/MatchDetailLoader';

export const metadata: Metadata = {
  title: 'Partida',
  description: 'Placar, fase, horário, local e melhor jogador da partida.',
};

interface MatchRouteProps {
  params: Promise<{ matchId: string }>;
}

export default function MatchRoute({ params }: MatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<MatchDetailSkeleton />}>
      <MatchDetailLoader params={params} />
    </Suspense>
  );
}
