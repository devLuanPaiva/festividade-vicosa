import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { buildScopeParams, situationParam } from '@/features/admin-matches/lib/match-list-api';
import type { RawSearchParams } from '@/features/admin-matches/lib/match-list-query';
import { getMatchDays, getMatchPage } from '@/features/admin-matches/services/get-match-page';
import { getSubEventCategories } from '@/features/games/services/get-game-categories';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { PaginationBar } from '@/features/admin-shell/components/PaginationBar';
import { buildGalleryMatchesHref } from '../../lib/gallery-match-href';
import { subEventGalleryPath } from '../../lib/admin-gallery-paths';
import {
  buildGalleryMatchView,
  hasActiveMatchFilter,
  parseGalleryMatchQuery,
  type GalleryMatchQuery,
  type GalleryMatchView,
} from '../../lib/gallery-match-view';
import { getSubEvent } from '../../services/get-gallery-data';
import { GalleryBreadcrumb } from '../GalleryBreadcrumb';
import { GalleryMatchDay } from './GalleryMatchDay';
import { GalleryMatchFilters } from './GalleryMatchFilters';

async function loadView(subEventId: string, query: GalleryMatchQuery): Promise<GalleryMatchView> {
  const [page, days, categories] = await Promise.all([
    getMatchPage({
      scope: buildScopeParams({ ...query, stage: 'todas' }, subEventId),
      situation: situationParam(query.status),
      order: 'asc',
      page: query.page,
      pageSize: query.pageSize,
    }),
    getMatchDays({ subEventId }),
    getSubEventCategories(subEventId),
  ]);
  return buildGalleryMatchView({ query, page, categories, days });
}

function MatchResults({
  subEventId,
  view,
}: {
  subEventId: string;
  view: GalleryMatchView;
}): ReactElement {
  const { query } = view;
  const now = new Date();
  if (view.total === 0) {
    return (
      <EmptyState
        icon="calendar"
        title={hasActiveMatchFilter(query) ? 'Nenhuma partida encontrada' : 'Ainda não há partidas'}
        description={
          hasActiveMatchFilter(query)
            ? 'Tente tirar algum filtro ou mudar a busca.'
            : 'As partidas aparecem aqui assim que forem cadastradas.'
        }
      />
    );
  }
  return (
    <>
      {view.groups.map((day) => (
        <GalleryMatchDay key={day.key} subEventId={subEventId} day={day} now={now} />
      ))}
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        <PaginationBar
          page={view.page}
          totalPages={view.totalPages}
          total={view.total}
          pageSize={query.pageSize}
          noun={{ singular: 'partida', plural: 'partidas' }}
          hrefFor={(changes) =>
            buildGalleryMatchesHref(subEventId, { ...query, page: 1, ...changes })
          }
        />
      </div>
    </>
  );
}

interface SubEventMatchesLoaderProps {
  params: Promise<{ subEventId: string }>;
  searchParams: Promise<RawSearchParams>;
}

export async function SubEventMatchesLoader({
  params,
  searchParams,
}: SubEventMatchesLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'photo:upload')) {
    return <NoPermission action="gerir a galeria de fotos" />;
  }
  const { subEventId } = await params;
  const [subEvent, view] = await Promise.all([
    getSubEvent(subEventId),
    loadView(subEventId, parseGalleryMatchQuery(await searchParams)),
  ]);
  return (
    <>
      <GalleryBreadcrumb
        crumbs={[{ label: subEvent.name, href: subEventGalleryPath(subEvent.id) }]}
        title="Por partidas"
      />
      <p className="text-sm text-admin-muted">
        Escolha a partida para enviar as fotos dela e a foto do melhor jogador.
      </p>
      <GalleryMatchFilters subEventId={subEvent.id} view={view} />
      <MatchResults subEventId={subEvent.id} view={view} />
    </>
  );
}
