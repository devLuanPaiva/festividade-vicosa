import type { ReactElement } from 'react';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { subEventAlbumsPath } from '../lib/gallery-paths';
import { getSubEventDays } from '../services/get-gallery';
import { AlbumCard } from './AlbumCard';
import { GallerySection } from './GallerySection';

const EMPTY_MESSAGE = 'As fotos serão publicadas durante a festividade. Volte em breve!';

export async function GalleryIndexLoader(): Promise<ReactElement> {
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const albums = await Promise.all(
    subEvents.map(async (subEvent) => ({ subEvent, days: await getSubEventDays(subEvent.id) })),
  );
  const withPhotos = albums.filter(({ days }) => days.length > 0);
  return (
    <GallerySection label="Álbuns por sub-evento">
      {withPhotos.length === 0 ? (
        <p className="text-lg text-ink-soft">{EMPTY_MESSAGE}</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withPhotos.map(({ subEvent, days }) => (
            <li key={subEvent.id}>
              <AlbumCard
                href={subEventAlbumsPath(subEvent.id)}
                title={subEvent.name}
                detail={formatDateRange(subEvent.startDate, subEvent.endDate)}
                coverPhotoKey={days[0]?.coverPhotoKey ?? null}
                photoCount={days.reduce((total, day) => total + day.photoCount, 0)}
              />
            </li>
          ))}
        </ul>
      )}
    </GallerySection>
  );
}
