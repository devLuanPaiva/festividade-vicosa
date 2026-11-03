import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { statusOfScope, subEventsOfModality, type GameFilterParams } from '../lib/game-filters';
import type { MatchListItem } from '../types';
import { getMatches } from './get-matches';

export const GAMES_YEAR = 2026;

function byScheduledAt(first: MatchListItem, second: MatchListItem): number {
  return first.scheduledAt.localeCompare(second.scheduledAt);
}

export async function getGameMatches(params: GameFilterParams): Promise<MatchListItem[]> {
  const subEvents = subEventsOfModality(await getEditionSubEvents(GAMES_YEAR), params.modality);
  const status = statusOfScope(params.scope);
  const lists = await Promise.all(
    subEvents.map((subEvent) =>
      getMatches({ subEventId: subEvent.id, categoryId: params.categoryId, status }),
    ),
  );
  const matches = lists.flat().sort(byScheduledAt);
  return params.scope === 'finalizados' ? matches.reverse() : matches;
}
