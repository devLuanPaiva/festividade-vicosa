import type { Metadata } from 'next';
import { getMatchImages } from '@/features/gallery/services/get-gallery';
import { buildShareMetadata } from '@/lib/share/build-share-metadata';
import { buildMatchShare } from '../lib/match-share';
import { getMatchDetail } from './get-match-detail';

const FALLBACK_TITLE = 'Partida';

function cardPath(matchId: string): string {
  return `/jogos/${matchId}/cartao`;
}

async function findSharedPhotoUrl(matchId: string, photoId: string | null): Promise<string | null> {
  if (photoId === null) {
    return null;
  }
  const images = await getMatchImages(matchId);
  return images.find((image) => image.id === photoId)?.largeUrl ?? null;
}

export async function getMatchMetadata(matchId: string, photoId: string | null): Promise<Metadata> {
  const detail = await getMatchDetail(matchId);
  if (!detail) {
    return { title: FALLBACK_TITLE };
  }
  const imageUrl = (await findSharedPhotoUrl(matchId, photoId)) ?? cardPath(matchId);
  return buildShareMetadata({ ...buildMatchShare(detail), imageUrl });
}
