import { ImageResponse } from 'next/og';
import { MatchShareCard } from '@/features/games/components/MatchShareCard';
import { getMatchDetail } from '@/features/games/services/get-match-detail';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const NOT_FOUND_STATUS = 404;

interface MatchCardRouteContext {
  params: Promise<{ matchId: string }>;
}

export async function GET(_request: Request, { params }: MatchCardRouteContext): Promise<Response> {
  const { matchId } = await params;
  const detail = await getMatchDetail(matchId);
  if (!detail) {
    return new Response(null, { status: NOT_FOUND_STATUS });
  }
  return new ImageResponse(<MatchShareCard detail={detail} />, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  });
}
