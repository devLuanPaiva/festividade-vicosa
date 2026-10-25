import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { fetchMatchDetail } from '@/features/games/services/get-match-detail';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { matchResultPath } from '../lib/admin-gallery-paths';
import { AlbumManager } from './AlbumManager';

interface MatchAlbumLoaderProps {
  params: Promise<{ matchId: string }>;
}

export async function MatchAlbumLoader({ params }: MatchAlbumLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir as fotos da partida" />;
  }
  const { matchId } = await params;
  const { teamA, teamB } = await orNotFound(fetchMatchDetail(matchId));
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href={matchResultPath(matchId)}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700"
        >
          ← Voltar à partida
        </Link>
        <h1 className="text-2xl font-bold">
          Fotos de {teamA.name} x {teamB.name}
        </h1>
      </header>
      <AlbumManager
        target={{ kind: 'match', matchId }}
        canManage={hasPermission(user, 'photo:delete')}
      />
    </>
  );
}
