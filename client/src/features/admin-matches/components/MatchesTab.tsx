import Link from 'next/link';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { GroupFixtureLinks } from '@/features/admin-suggestions/components/GroupFixtureLinks';
import type { MatchGroup } from '@/features/admin-teams/types';
import type { CategoryMatchDay } from '../lib/category-match-days';
import { editMatchPath, newMatchPath } from '../lib/admin-match-paths';

interface MatchesTabProps {
  categoryId: string;
  days: CategoryMatchDay[];
  groups: MatchGroup[];
}

const PRIMARY_LINK_CLASS =
  'inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700';

function EmptyMatches(): ReactElement {
  return (
    <EmptyState
      tone="admin"
      icon="calendar"
      title="Nenhuma partida ainda"
      description="Cadastre as partidas da fase de grupos e do mata-mata. O resultado é lançado depois, na aba Jogos."
    />
  );
}

function MatchDay({
  categoryId,
  day,
}: {
  categoryId: string;
  day: CategoryMatchDay;
}): ReactElement {
  return (
    <section aria-label={day.heading}>
      <h2 className="border-b border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted">
        {day.heading}
      </h2>
      <ul className="divide-y divide-admin-line">
        {day.rows.map((row) => (
          <li key={row.id}>
            <Link
              href={editMatchPath(categoryId, row.id)}
              className="flex min-h-16 items-center justify-between gap-3 px-4 hover:bg-admin-canvas"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-semibold text-brand-700">{row.teams}</span>
                <span className="truncate text-sm text-admin-muted">
                  {row.time} · {row.stage}
                </span>
              </span>
              <span
                className={`shrink-0 text-sm ${row.isFinalized ? 'text-success' : 'text-admin-muted'}`}
              >
                {row.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MatchesTab({ categoryId, days, groups }: MatchesTabProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Link href={newMatchPath(categoryId)} className={`${PRIMARY_LINK_CLASS} self-start`}>
        Nova partida
      </Link>
      <GroupFixtureLinks categoryId={categoryId} groups={groups} />
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {days.length === 0 ? <EmptyMatches /> : null}
        {days.map((day) => (
          <MatchDay key={day.key} categoryId={categoryId} day={day} />
        ))}
      </div>
    </div>
  );
}
