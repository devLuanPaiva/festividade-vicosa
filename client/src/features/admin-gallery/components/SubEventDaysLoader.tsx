import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { dayGalleryPath } from '../lib/admin-gallery-paths';
import { eachDay } from '../lib/each-day';
import { photoCountLabel } from '../lib/photo-count-label';
import { getGalleryDays, getSubEvent } from '../services/get-gallery-data';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';
import { GalleryLink } from './GalleryLink';

interface SubEventDaysLoaderProps {
  params: Promise<{ subEventId: string }>;
}

export async function SubEventDaysLoader({
  params,
}: SubEventDaysLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const { subEventId } = await params;
  const [subEvent, days] = await Promise.all([getSubEvent(subEventId), getGalleryDays(subEventId)]);
  const counts = new Map(days.map((day) => [day.date, day.photoCount]));
  return (
    <>
      <GalleryBreadcrumb title={subEvent.name} />
      <p className="text-sm text-admin-muted">Cada dia tem o seu álbum. Escolha o dia.</p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {eachDay(subEvent.startDate, subEvent.endDate).map((date) => (
          <li key={date}>
            <GalleryLink
              href={dayGalleryPath(subEvent.id, date)}
              title={formatDateRange(date, date)}
              detail={photoCountLabel(counts.get(date) ?? 0)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
