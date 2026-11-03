import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { readSharedPhotoId } from '@/lib/share/share-links';
import { getMatchImages } from '@/features/gallery/services/get-gallery';
import { getMatchDetail } from '../services/get-match-detail';
import { MatchDetailView } from './MatchDetailView';

interface MatchDetailLoaderProps {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function MatchDetailLoader({
  params,
  searchParams,
}: MatchDetailLoaderProps): Promise<ReactElement> {
  const { matchId } = await params;
  const sharedPhotoId = readSharedPhotoId((await searchParams).foto);
  const [detail, images] = await Promise.all([getMatchDetail(matchId), getMatchImages(matchId)]);
  if (!detail) {
    notFound();
  }
  return <MatchDetailView detail={detail} images={images} sharedPhotoId={sharedPhotoId} />;
}
