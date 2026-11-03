import type { ReactElement } from 'react';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import {
  deletePhotoAction,
  reorderPhotosAction,
  uploadAlbumPhotoAction,
} from '../actions/photo-actions';
import { getAlbumPhotos } from '../services/get-gallery-data';
import type { AlbumPhoto, AlbumTarget } from '../types';
import { PhotoGrid, type GridPhoto } from './PhotoGrid';
import { PhotoUploader } from './PhotoUploader';

interface AlbumManagerProps {
  target: AlbumTarget;
  canManage: boolean;
}

function toGridPhotos(photos: AlbumPhoto[]): GridPhoto[] {
  return photos.flatMap(({ id, photoKey }) => {
    const url = resolvePhotoUrl(photoKey, 'thumb');
    return url ? [{ id, url }] : [];
  });
}

export async function AlbumManager({
  target,
  canManage,
}: AlbumManagerProps): Promise<ReactElement> {
  const photos = await getAlbumPhotos(target);
  return (
    <>
      <PhotoUploader upload={uploadAlbumPhotoAction.bind(null, target)} />
      <PhotoGrid
        photos={toGridPhotos(photos)}
        canManage={canManage}
        reorderAction={reorderPhotosAction}
        deleteAction={deletePhotoAction}
      />
    </>
  );
}
