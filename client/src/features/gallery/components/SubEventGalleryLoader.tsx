import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { readSharedPhotoId } from '@/lib/share/share-links';
import { GALLERY_PATH } from '../lib/gallery-paths';
import { getSubEventImages } from '../services/get-gallery';
import { GallerySection } from './GallerySection';
import { PhotoGallery } from './PhotoGallery';

interface SubEventGalleryLoaderProps {
  params: Promise<{ subEventId: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function SubEventGalleryLoader({
  params,
  searchParams,
}: SubEventGalleryLoaderProps): Promise<ReactElement> {
  const { subEventId } = await params;
  const sharedPhotoId = readSharedPhotoId((await searchParams).foto);
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  const subEvent = subEvents.find((candidate) => candidate.id === subEventId);
  if (!subEvent) {
    notFound();
  }
  const images = await getSubEventImages(subEvent.id);
  return (
    <>
      <PageHero eyebrow="Galeria" title={subEvent.name} />
      <GallerySection label={`Fotos de ${subEvent.name}`}>
        {images.length === 0 ? (
          <EmptyState
            icon="image"
            title="Ainda não há fotos deste evento"
            description="Assim que a equipe publicar as fotos, elas aparecem aqui."
          />
        ) : (
          <PhotoGallery
            images={images}
            fileBase="festividade-vicosa"
            shareText={`Foto de ${subEvent.name}`}
            initialPhotoId={sharedPhotoId}
          />
        )}
        <div>
          <ButtonLink href={GALLERY_PATH} variant="brand">
            Todas as galerias
          </ButtonLink>
        </div>
      </GallerySection>
    </>
  );
}
