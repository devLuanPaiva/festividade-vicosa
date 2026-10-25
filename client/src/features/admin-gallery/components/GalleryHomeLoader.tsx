import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { FESTIVAL_YEAR } from '@/lib/config/festival';
import { subEventGalleryPath } from '../lib/admin-gallery-paths';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';
import { GalleryLink } from './GalleryLink';

export async function GalleryHomeLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const subEvents = await getEditionSubEvents(FESTIVAL_YEAR);
  return (
    <>
      <GalleryBreadcrumb title="Galeria de fotos" />
      <p className="text-sm text-admin-muted">
        Escolha o sub-evento para ver os dias e enviar fotos.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subEvents.map((subEvent) => (
          <li key={subEvent.id}>
            <GalleryLink
              href={subEventGalleryPath(subEvent.id)}
              title={subEvent.name}
              detail={formatDateRange(subEvent.startDate, subEvent.endDate)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
