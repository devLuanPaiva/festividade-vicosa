import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { subEventAlbumsPath } from '../lib/gallery-paths';
import { getDayImages } from '../services/get-gallery';
import { GallerySection } from './GallerySection';
import { PhotoGallery } from './PhotoGallery';

const ISO_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface DayAlbumLoaderProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export async function DayAlbumLoader({ params }: DayAlbumLoaderProps): Promise<ReactElement> {
  const { subEventId, date } = await params;
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const subEvent = subEvents.find((candidate) => candidate.id === subEventId);
  if (!subEvent || !ISO_DAY_PATTERN.test(date)) {
    notFound();
  }
  const images = await getDayImages(subEvent.id, date);
  return (
    <>
      <PageHero eyebrow={subEvent.name} title={formatDateRange(date, date)} />
      <GallerySection label={`Fotos de ${formatDateRange(date, date)}`}>
        {images.length === 0 ? (
          <p className="text-lg text-ink-soft">Ainda não há fotos neste dia. Volte em breve!</p>
        ) : (
          <PhotoGallery images={images} />
        )}
        <div>
          <ButtonLink href={subEventAlbumsPath(subEvent.id)} variant="brand">
            Outros dias
          </ButtonLink>
        </div>
      </GallerySection>
    </>
  );
}
