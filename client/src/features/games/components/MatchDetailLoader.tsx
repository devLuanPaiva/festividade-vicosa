import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { getMatchDetail } from '../services/get-match-detail';
import { MatchDetailView } from './MatchDetailView';

interface MatchDetailLoaderProps {
  params: Promise<{ matchId: string }>;
}

export async function MatchDetailLoader({ params }: MatchDetailLoaderProps): Promise<ReactElement> {
  const { matchId } = await params;
  const detail = await getMatchDetail(matchId);
  if (!detail) {
    notFound();
  }
  return <MatchDetailView detail={detail} />;
}
