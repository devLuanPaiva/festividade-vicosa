import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { buildDayColumns } from '../lib/day-columns';
import { buildKpiTiles } from '../lib/kpi-tiles';
import type { DashboardData } from '../types';
import { CategoryProgressList } from './CategoryProgressList';
import { KpiTile } from './KpiTile';
import { MatchesByDayChart } from './MatchesByDayChart';
import { RecentResultsList } from './RecentResultsList';

interface DashboardViewProps {
  firstName: string;
  data: DashboardData;
  now: Date;
}

function EmptyChampionship(): ReactElement {
  return (
    <section className="flex flex-col items-start gap-2 rounded-2xl border border-admin-line bg-admin-surface p-5">
      <h2 className="text-lg font-bold">Nenhuma partida cadastrada ainda</h2>
      <p className="text-sm text-admin-muted">
        Cadastre os times e as partidas para acompanhar o andamento do campeonato por aqui.
      </p>
      <Link
        href={ADMIN_CATEGORIES_PATH}
        className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
      >
        Ir para o campeonato
      </Link>
    </section>
  );
}

export function DashboardView({ firstName, data, now }: DashboardViewProps): ReactElement {
  const { overview, matchesByDay, categoriesProgress, recentResults } = data;
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Olá, {firstName}</h1>
        <p className="text-sm text-admin-muted">
          Resumo do campeonato: o que já aconteceu e o que ainda falta lançar.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {buildKpiTiles(overview).map((tile) => (
          <li key={tile.key} className="min-w-0 last:col-span-2 xl:last:col-span-1">
            <KpiTile tile={tile} />
          </li>
        ))}
      </ul>
      {matchesByDay.length === 0 ? (
        <EmptyChampionship />
      ) : (
        <MatchesByDayChart columns={buildDayColumns(matchesByDay)} />
      )}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <CategoryProgressList categories={categoriesProgress} />
        <RecentResultsList results={recentResults} now={now} />
      </div>
    </>
  );
}
