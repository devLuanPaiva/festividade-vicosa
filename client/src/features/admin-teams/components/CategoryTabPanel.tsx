import { Suspense, type ReactElement } from 'react';
import { LoadingRegion, Skeleton } from '@/components/loading/Skeleton';
import { BracketTab } from '@/features/admin-bracket/components/BracketTab';
import { MatchesTab } from '@/features/admin-matches/components/MatchesTab';
import { buildCategoryMatchDays } from '@/features/admin-matches/lib/category-match-days';
import { QualifiedTab } from '@/features/admin-qualified/components/QualifiedTab';
import type { CategoryTab } from '../lib/category-tabs';
import type { CategoryDetail } from '../services/get-category-detail';
import { GroupsTab } from './GroupsTab';
import { TeamsTab } from './TeamsTab';

interface CategoryTabPanelProps {
  activeTab: CategoryTab;
  detail: CategoryDetail;
}

function Loading({ text }: { text: string }): ReactElement {
  return (
    <LoadingRegion label={text}>
      <Skeleton tone="admin" className="h-40 w-full rounded-2xl" />
    </LoadingRegion>
  );
}

const PANELS: Record<CategoryTab, (detail: CategoryDetail) => ReactElement> = {
  times: ({ category, groups, teams }) => (
    <TeamsTab categoryId={category.id} groups={groups} teams={teams} />
  ),
  grupos: ({ category, groups, teams }) => (
    <GroupsTab categoryId={category.id} groups={groups} teams={teams} />
  ),
  classificados: ({ category }) => (
    <Suspense fallback={<Loading text="Carregando classificação…" />}>
      <QualifiedTab categoryId={category.id} />
    </Suspense>
  ),
  partidas: ({ category, groups, teams, matches }) => (
    <MatchesTab
      categoryId={category.id}
      days={buildCategoryMatchDays(matches ?? [], teams, groups)}
    />
  ),
  chaveamento: ({ category, matches }) => (
    <Suspense fallback={<Loading text="Carregando classificados…" />}>
      <BracketTab categoryId={category.id} matches={matches ?? []} />
    </Suspense>
  ),
};

export function CategoryTabPanel({ activeTab, detail }: CategoryTabPanelProps): ReactElement {
  return PANELS[activeTab](detail);
}
