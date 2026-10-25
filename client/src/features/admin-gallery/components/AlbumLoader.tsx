import type { ReactElement } from 'react';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import {
  deletePhotoAction,
  reorderPhotosAction,
  uploadAlbumPhotoAction,
} from '../actions/photo-actions';
import { getAlbumPhotos, getSubEvent } from '../services/get-gallery-data';
import type { AlbumPhoto } from '../types';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';
import { PhotoGrid, type GridPhoto } from './PhotoGrid';
import { PhotoUploader } from './PhotoUploader';

interface AlbumLoaderProps {
  params: Promise<{ subEventId: string; date: string }>;
}

function toGridPhotos(photos: AlbumPhoto[]): GridPhoto[] {
  return photos.flatMap(({ id, photoKey }) => {
    const url = resolvePhotoUrl(photoKey, 'thumb');
    return url ? [{ id, url }] : [];
  });
}

export async function AlbumLoader({ params }: AlbumLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const { subEventId, date } = await params;
  const target = { kind: 'event-day', subEventId, date } as const;
  const [subEvent, photos] = await Promise.all([getSubEvent(subEventId), getAlbumPhotos(target)]);
  return (
    <>
      <GalleryBreadcrumb subEvent={subEvent} title={formatDateRange(date, date)} />
      <PhotoUploader upload={uploadAlbumPhotoAction.bind(null, target)} />
      <PhotoGrid
        photos={toGridPhotos(photos)}
        canManage={hasPermission(user, 'photo:delete')}
        reorderAction={reorderPhotosAction}
        deleteAction={deletePhotoAction}
      />
    </>
  );
}
