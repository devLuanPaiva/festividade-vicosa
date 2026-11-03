import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatMatchTime } from '@/features/games/lib/match-dates';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import { fetchMatchDetail } from '@/features/games/services/get-match-detail';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import {
  matchResultPath,
  subEventGalleryPath,
  subEventMatchesPath,
} from '../../lib/admin-gallery-paths';
import { getSubEvent } from '../../services/get-gallery-data';
import { AlbumManager } from '../AlbumManager';
import { BestPlayerPhotoSection } from '../BestPlayerPhotoSection';
import { GalleryBreadcrumb } from '../GalleryBreadcrumb';

interface MatchMediaLoaderProps {
  params: Promise<{ subEventId: string; matchId: string }>;
}

export async function MatchMediaLoader({ params }: MatchMediaLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir as fotos da partida" />;
  }
  const { subEventId, matchId } = await params;
  const [subEvent, detail] = await Promise.all([
    getSubEvent(subEventId),
    orNotFound(fetchMatchDetail(matchId)),
  ]);
  const { match, teamA, teamB, category, groupName } = detail;
  return (
    <>
      <GalleryBreadcrumb
        crumbs={[
          { label: subEvent.name, href: subEventGalleryPath(subEvent.id) },
          { label: 'Por partidas', href: subEventMatchesPath(subEvent.id) },
        ]}
        title={`${teamA.name} x ${teamB.name}`}
      />
      <p className="text-sm text-admin-muted">
        {categoryLabel(category)} · {stageLabel(match, groupName ?? undefined)} ·{' '}
        {formatMatchTime(match.scheduledAt)}
      </p>
      {hasPermission(user, 'match:record-score') ? (
        <BestPlayerPhotoSection match={match} resultHref={matchResultPath(match.id)} />
      ) : null}
      <section aria-labelledby="match-photos-title" className="flex flex-col gap-4">
        <h2 id="match-photos-title" className="font-bold">
          Galeria da partida
        </h2>
        <p className="text-sm text-admin-muted">
          Estas fotos também aparecem no álbum do dia da partida.{' '}
          <Link href={matchResultPath(match.id)} className="font-semibold text-brand-700">
            Lançar resultado ›
          </Link>
        </p>
        <AlbumManager
          target={{ kind: 'match', matchId }}
          canManage={hasPermission(user, 'photo:delete')}
        />
      </section>
    </>
  );
}
