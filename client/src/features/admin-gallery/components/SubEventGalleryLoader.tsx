import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { getSubEvent } from '../services/get-gallery-data';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';
import { PhotoManager } from './PhotoManager';

interface SubEventGalleryLoaderProps {
  params: Promise<{ subEventId: string }>;
}

export async function SubEventGalleryLoader({
  params,
}: Readonly<SubEventGalleryLoaderProps>): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const subEvent = await getSubEvent((await params).subEventId);
  return (
    <>
      <GalleryBreadcrumb title={subEvent.name} />
      <PhotoManager subEventId={subEvent.id} canManage={hasPermission(user, 'photo:delete')} />
    </>
  );
}
