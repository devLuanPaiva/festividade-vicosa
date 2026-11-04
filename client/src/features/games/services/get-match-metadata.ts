import type { Metadata } from 'next';
import { buildShareMetadata } from '@/lib/share/build-share-metadata';
import { buildMatchShare } from '../lib/match-share';
import { getMatchDetail } from './get-match-detail';

const FALLBACK_TITLE = 'Partida';

function cardPath(matchId: string): string {
  return `/jogos/${matchId}/cartao`;
}

export async function getMatchMetadata(matchId: string): Promise<Metadata> {
  const detail = await getMatchDetail(matchId);
  if (!detail) {
    return { title: FALLBACK_TITLE };
  }
  return buildShareMetadata({ ...buildMatchShare(detail), imageUrl: cardPath(matchId) });
}
