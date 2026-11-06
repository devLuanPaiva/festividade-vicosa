import type { Metadata } from 'next';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';
import { GalleryPhotosSkeleton } from '@/features/gallery/components/GallerySkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventGalleryLoader } from '@/features/gallery/components/SubEventGalleryLoader';
import { getSubEventGalleryMetadata } from '@/features/gallery/services/get-sub-event-gallery-metadata';
import { readSharedPhotoId } from '@/lib/share/share-links';

interface SubEventGalleryRouteProps {
  params: Promise<{ subEventId: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Readonly<SubEventGalleryRouteProps>): Promise<Metadata> {
  const { subEventId } = await params;
  return getSubEventGalleryMetadata(subEventId, readSharedPhotoId((await searchParams).foto));
}

export default function SubEventGalleryRoute({
  params,
  searchParams,
}: Readonly<SubEventGalleryRouteProps>): ReactElement {
  return (
    <Suspense
      fallback={
        <PublicPageSkeleton label="Carregando as fotos">
          <GalleryPhotosSkeleton />
        </PublicPageSkeleton>
      }
    >
      <SubEventGalleryLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
