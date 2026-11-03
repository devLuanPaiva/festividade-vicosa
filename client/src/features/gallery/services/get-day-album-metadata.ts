import type { Metadata } from 'next';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { buildShareMetadata } from '@/lib/share/build-share-metadata';
import { getDayImages } from './get-gallery';

const FALLBACK: Metadata = {
  title: 'Álbum do dia',
  description: 'Fotos do dia na festividade de Viçosa.',
};

export async function getDayAlbumMetadata(
  subEventId: string,
  date: string,
  photoId: string | null,
): Promise<Metadata> {
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const subEvent = subEvents.find((candidate) => candidate.id === subEventId);
  if (!subEvent) {
    return FALLBACK;
  }
  const images = photoId === null ? [] : await getDayImages(subEventId, date);
  return buildShareMetadata({
    title: `${subEvent.name} · ${formatDateRange(date, date)}`,
    description: 'Fotos da festividade de Viçosa.',
    imageUrl: images.find((image) => image.id === photoId)?.largeUrl,
  });
}
