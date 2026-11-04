import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { subEventGalleryPath } from '../lib/gallery-paths';
import { getGallerySummary } from '../services/get-gallery';
import { AlbumCard } from './AlbumCard';
import { GallerySection } from './GallerySection';

export async function GalleryIndexLoader(): Promise<ReactElement> {
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const galleries = await Promise.all(
    subEvents.map(async (subEvent) => ({
      subEvent,
      summary: await getGallerySummary(subEvent.id),
    })),
  );
  const withPhotos = galleries.filter(({ summary }) => summary.photoCount > 0);
  return (
    <GallerySection label="Fotos por sub-evento">
      {withPhotos.length === 0 ? (
        <EmptyState
          icon="image"
          title="As fotos chegam em breve"
          description="As fotos são publicadas durante a festividade. Volte para conferir os melhores momentos!"
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withPhotos.map(({ subEvent, summary }) => (
            <li key={subEvent.id}>
              <AlbumCard
                href={subEventGalleryPath(subEvent.id)}
                title={subEvent.name}
                detail={formatDateRange(subEvent.startDate, subEvent.endDate)}
                coverPhotoKey={summary.coverPhotoKey}
                photoCount={summary.photoCount}
              />
            </li>
          ))}
        </ul>
      )}
    </GallerySection>
  );
}
