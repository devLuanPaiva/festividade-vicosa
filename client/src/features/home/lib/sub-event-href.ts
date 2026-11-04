import { buildGamesHref, modalitySlugOfType } from '@/features/games/lib/game-filters';
import { GALLERY_PATH, subEventGalleryPath } from '@/features/gallery/lib/gallery-paths';
import type { SubEvent, SubEventType } from '@/features/schedule/types';

export function subEventHref(subEvent: Pick<SubEvent, 'id' | 'type'>): string {
  const modality = modalitySlugOfType(subEvent.type);
  return modality
    ? buildGamesHref({ modality, scope: 'proximos' })
    : subEventGalleryPath(subEvent.id);
}

export function hrefOfType(type: SubEventType, subEvents: SubEvent[]): string {
  const subEvent = subEvents.find((candidate) => candidate.type === type);
  return subEvent ? subEventHref(subEvent) : GALLERY_PATH;
}
