import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { dayAlbumPath, GALLERY_PATH } from '../lib/gallery-paths';
import { getSubEventDays } from '../services/get-gallery';
import { AlbumCard } from './AlbumCard';
import { GallerySection } from './GallerySection';

interface SubEventAlbumsLoaderProps {
  params: Promise<{ subEventId: string }>;
}

export async function SubEventAlbumsLoader({
  params,
}: SubEventAlbumsLoaderProps): Promise<ReactElement> {
  const { subEventId } = await params;
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const subEvent = subEvents.find((candidate) => candidate.id === subEventId);
  if (!subEvent) {
    notFound();
  }
  const days = await getSubEventDays(subEvent.id);
  return (
    <>
      <PageHero eyebrow="Galeria" title={subEvent.name} />
      <GallerySection label={`Álbuns de ${subEvent.name}`}>
        {days.length === 0 ? (
          <EmptyState
            icon="image"
            title="Ainda não há fotos deste evento"
            description="Assim que a equipe publicar as fotos, os álbuns aparecem aqui, dia a dia."
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => (
              <li key={day.date}>
                <AlbumCard
                  href={dayAlbumPath(subEvent.id, day.date)}
                  title={formatDateRange(day.date, day.date)}
                  detail={subEvent.name}
                  coverPhotoKey={day.coverPhotoKey}
                  photoCount={day.photoCount}
                />
              </li>
            ))}
          </ul>
        )}
        <div>
          <ButtonLink href={GALLERY_PATH} variant="brand">
            Todos os álbuns
          </ButtonLink>
        </div>
      </GallerySection>
    </>
  );
}
