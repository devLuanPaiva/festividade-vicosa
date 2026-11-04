import type { ReactElement } from 'react';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import {
  deletePhotoAction,
  reorderPhotosAction,
  uploadSubEventPhotoAction,
} from '../actions/photo-actions';
import { getSubEventPhotos } from '../services/get-gallery-data';
import type { SubEventPhoto } from '../types';
import { PhotoGrid, type GridPhoto } from './PhotoGrid';
import { PhotoUploader } from './PhotoUploader';

interface PhotoManagerProps {
  subEventId: string;
  canManage: boolean;
}

function toGridPhotos(photos: SubEventPhoto[]): GridPhoto[] {
  return photos.flatMap(({ id, photoKey }) => {
    const url = resolvePhotoUrl(photoKey, 'thumb');
    return url ? [{ id, url }] : [];
  });
}

export async function PhotoManager({
  subEventId,
  canManage,
}: PhotoManagerProps): Promise<ReactElement> {
  const photos = await getSubEventPhotos(subEventId);
  return (
    <>
      <PhotoUploader upload={uploadSubEventPhotoAction.bind(null, subEventId)} />
      <PhotoGrid
        photos={toGridPhotos(photos)}
        canManage={canManage}
        reorderAction={reorderPhotosAction}
        deleteAction={deletePhotoAction}
      />
    </>
  );
}
