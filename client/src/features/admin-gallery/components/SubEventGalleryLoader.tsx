import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { isChampionshipSubEvent } from '../lib/championship-sub-event';
import { getSubEvent } from '../services/get-gallery-data';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';
import { GalleryModeChooser } from './GalleryModeChooser';
import { SubEventDaysLoader } from './SubEventDaysLoader';

interface SubEventGalleryLoaderProps {
  params: Promise<{ subEventId: string }>;
}

export async function SubEventGalleryLoader({
  params,
}: SubEventGalleryLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const subEvent = await getSubEvent((await params).subEventId);
  if (!isChampionshipSubEvent(subEvent)) {
    return <SubEventDaysLoader params={params} />;
  }
  return (
    <>
      <GalleryBreadcrumb title={subEvent.name} />
      <p className="text-sm text-admin-muted">Como você quer organizar o envio das fotos?</p>
      <GalleryModeChooser subEventId={subEvent.id} />
    </>
  );
}
