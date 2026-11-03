import type { ReactElement } from 'react';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { ModalityGrid } from './ModalityGrid';

export async function ModalityList(): Promise<ReactElement> {
  return <ModalityGrid subEvents={await getEditionSubEvents(FESTIVAL_YEAR)} />;
}
