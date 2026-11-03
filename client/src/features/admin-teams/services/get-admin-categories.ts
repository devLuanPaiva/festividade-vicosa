import { categoryLabel } from '@/features/games/lib/match-labels';
import { MODALITIES } from '@/features/games/lib/game-filters';
import type { Category } from '@/features/games/types';
import type { Edition, SubEvent } from '@/features/schedule/types';
import { fetchApiPage } from '@/lib/api/server-fetch';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import type { ModalityCategories } from '../types';

const MAX_CATEGORIES = 100;

async function fetchSubEvents(): Promise<SubEvent[]> {
  const [edition] = await fetchApiPage<Edition>(`/editions?year=${FESTIVAL_YEAR}&limit=1`);
  return edition ? fetchApiPage<SubEvent>(`/editions/${edition.id}/sub-events`) : [];
}

async function fetchCategories(subEvent: SubEvent | undefined): Promise<Category[]> {
  return subEvent
    ? fetchApiPage<Category>(`/sub-events/${subEvent.id}/categories?limit=${MAX_CATEGORIES}`)
    : [];
}

export async function getAdminCategories(): Promise<ModalityCategories[]> {
  const subEvents = await fetchSubEvents();
  return Promise.all(
    MODALITIES.map(async (modality) => {
      const categories = await fetchCategories(
        subEvents.find((subEvent) => subEvent.type === modality.type),
      );
      return {
        modalityLabel: modality.label,
        categories: categories.map((category) => ({
          id: category.id,
          label: categoryLabel(category),
        })),
      };
    }),
  );
}
