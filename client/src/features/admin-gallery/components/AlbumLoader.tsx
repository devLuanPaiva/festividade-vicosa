import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { getSubEvent } from '../services/get-gallery-data';
import { AlbumManager } from './AlbumManager';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';

interface AlbumLoaderProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export async function AlbumLoader({ params }: AlbumLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const { subEventId, date } = await params;
  const subEvent = await getSubEvent(subEventId);
  return (
    <>
      <GalleryBreadcrumb subEvent={subEvent} title={formatDateRange(date, date)} />
      <AlbumManager
        target={{ kind: 'event-day', subEventId, date }}
        canManage={hasPermission(user, 'photo:delete')}
      />
    </>
  );
}
