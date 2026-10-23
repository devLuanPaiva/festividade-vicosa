import type { GetStaticPropsResult } from 'next';
import { fetchSubEventsOfEdition } from '@/features/schedule/schedule-service';
import type { HomePageProps } from './HomePage';

const FESTIVAL_YEAR = 2026;
const REVALIDATE_SECONDS = 60;
const RETRY_SECONDS = 10;

export async function loadHomeProps(): Promise<GetStaticPropsResult<HomePageProps>> {
  try {
    const subEvents = await fetchSubEventsOfEdition(FESTIVAL_YEAR);
    return { props: { subEvents }, revalidate: REVALIDATE_SECONDS };
  } catch {
    return { props: { subEvents: [] }, revalidate: RETRY_SECONDS };
  }
}
