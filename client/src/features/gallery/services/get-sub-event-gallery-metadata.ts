import type { Metadata } from 'next';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { buildShareMetadata } from '@/lib/share/build-share-metadata';
import { getSubEventImages } from './get-gallery';

const FALLBACK: Metadata = {
  title: 'Galeria do evento',
  description: 'Fotos da JOCEV’S.',
};

export async function getSubEventGalleryMetadata(
  subEventId: string,
  photoId: string | null,
): Promise<Metadata> {
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const subEvent = subEvents.find((candidate) => candidate.id === subEventId);
  if (!subEvent) {
    return FALLBACK;
  }
  const images = photoId === null ? [] : await getSubEventImages(subEventId);
  return buildShareMetadata({
    title: subEvent.name,
    description: 'Fotos da JOCEV’S.',
    imageUrl: images.find((image) => image.id === photoId)?.largeUrl,
  });
}
