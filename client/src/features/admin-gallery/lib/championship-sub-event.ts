import { modalitySlugOfType } from '@/features/games/lib/game-filters';
import type { SubEvent } from '@/features/schedule/types';

export function isChampionshipSubEvent(subEvent: Pick<SubEvent, 'type'>): boolean {
  return modalitySlugOfType(subEvent.type) !== undefined;
}
