import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { subEventDaysPath, subEventGalleryPath } from '../lib/admin-gallery-paths';
import { getSubEvent } from '../services/get-gallery-data';
import { isChampionshipSubEvent } from '../lib/championship-sub-event';
import { AlbumManager } from './AlbumManager';
import type { SubEvent } from '@/features/schedule/types';
import { GalleryBreadcrumb, type Crumb } from './GalleryBreadcrumb';

function dayCrumbs(subEvent: SubEvent): Crumb[] {
  const base = { label: subEvent.name, href: subEventGalleryPath(subEvent.id) };
  return isChampionshipSubEvent(subEvent)
    ? [base, { label: 'Por dia', href: subEventDaysPath(subEvent.id) }]
    : [base];
}

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
      <GalleryBreadcrumb crumbs={dayCrumbs(subEvent)} title={formatDateRange(date, date)} />
      {isChampionshipSubEvent(subEvent) ? (
        <p className="text-sm text-admin-muted">
          Aqui ficam as fotos gerais do dia. As fotos das partidas deste dia também aparecem no
          álbum público.
        </p>
      ) : null}
      <AlbumManager
        target={{ kind: 'event-day', subEventId, date }}
        canManage={hasPermission(user, 'photo:delete')}
      />
    </>
  );
}
