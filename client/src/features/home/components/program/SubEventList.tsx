import type { ReactElement } from 'react';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { SubEventGrid } from './SubEventGrid';

interface SubEventListProps {
  year: number;
}

export async function SubEventList({ year }: Readonly<SubEventListProps>): Promise<ReactElement> {
  const subEvents = await getEditionSubEvents(year);
  return <SubEventGrid subEvents={subEvents} />;
}
