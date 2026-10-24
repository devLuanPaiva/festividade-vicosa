import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { getCategory } from '../services/get-category';
import { getCategoryStandings } from '../services/get-category-standings';
import { GAMES_YEAR } from '../services/get-game-matches';
import { getMatches } from '../services/get-matches';
import { CategoryView } from './CategoryView';

interface CategoryLoaderProps {
  params: Promise<{ categoryId: string }>;
}

export async function CategoryLoader({ params }: CategoryLoaderProps): Promise<ReactElement> {
  const { categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) {
    notFound();
  }
  const [standings, knockoutMatches, subEvents] = await Promise.all([
    getCategoryStandings(categoryId),
    getMatches({ categoryId, stage: 'KNOCKOUT' }),
    getEditionSubEvents(GAMES_YEAR),
  ]);
  const subEvent = subEvents.find((item) => item.id === category.subEventId);
  return (
    <CategoryView
      category={category}
      subEvent={subEvent}
      standings={standings}
      knockoutMatches={knockoutMatches}
    />
  );
}
