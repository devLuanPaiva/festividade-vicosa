import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { getMatchImages } from '@/features/gallery/services/get-gallery';
import { getMatchDetail } from '../services/get-match-detail';
import { MatchDetailView } from './MatchDetailView';

interface MatchDetailLoaderProps {
  params: Promise<{ matchId: string }>;
}

export async function MatchDetailLoader({ params }: MatchDetailLoaderProps): Promise<ReactElement> {
  const { matchId } = await params;
  const [detail, images] = await Promise.all([getMatchDetail(matchId), getMatchImages(matchId)]);
  if (!detail) {
    notFound();
  }
  return <MatchDetailView detail={detail} images={images} />;
}
