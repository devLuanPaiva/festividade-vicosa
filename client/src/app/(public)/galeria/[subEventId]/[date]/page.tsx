import type { Metadata } from 'next';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';
import { DayPhotosSkeleton } from '@/features/gallery/components/GallerySkeletons';
import { Suspense, type ReactElement } from 'react';
import { DayAlbumLoader } from '@/features/gallery/components/DayAlbumLoader';
import { getDayAlbumMetadata } from '@/features/gallery/services/get-day-album-metadata';
import { readSharedPhotoId } from '@/lib/share/share-links';

interface DayAlbumRouteProps {
  params: Promise<{ subEventId: string; date: string }>;
  searchParams: Promise<{ foto?: string | string[] }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: DayAlbumRouteProps): Promise<Metadata> {
  const { subEventId, date } = await params;
  return getDayAlbumMetadata(subEventId, date, readSharedPhotoId((await searchParams).foto));
}

export default function DayAlbumRoute({ params, searchParams }: DayAlbumRouteProps): ReactElement {
  return (
    <Suspense
      fallback={
        <PublicPageSkeleton label="Carregando as fotos">
          <DayPhotosSkeleton />
        </PublicPageSkeleton>
      }
    >
      <DayAlbumLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
