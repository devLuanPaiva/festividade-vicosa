import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { readSharedPhotoId } from '@/lib/share/share-links';
import { subEventAlbumsPath } from '../lib/gallery-paths';
import { getDayImages } from '../services/get-gallery';
import { GallerySection } from './GallerySection';
import { PhotoGallery } from './PhotoGallery';

const ISO_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface DayAlbumLoaderProps {
  params: Promise<{ subEventId: string; date: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function DayAlbumLoader({
  params,
  searchParams,
}: DayAlbumLoaderProps): Promise<ReactElement> {
  const { subEventId, date } = await params;
  const sharedPhotoId = readSharedPhotoId((await searchParams).foto);
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
          <EmptyState
            icon="image"
            title="Ainda não há fotos neste dia"
            description="As fotos deste dia ainda não foram publicadas. Volte em breve!"
          />
        ) : (
          <PhotoGallery
            images={images}
            fileBase={`festividade-vicosa-${date}`}
            shareText={`Foto de ${subEvent.name}, ${formatDateRange(date, date)}`}
            initialPhotoId={sharedPhotoId}
          />
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
