import Link from 'next/link';
import type { ReactElement } from 'react';
import type { Team } from '@/features/games/types';
import { newTeamPath, teamPath } from '../lib/admin-team-paths';
import { buildRosterSections } from '../lib/roster-sections';
import type { MatchGroup } from '../types';

interface TeamsTabProps {
  categoryId: string;
  groups: MatchGroup[];
  teams: Team[];
}

function teamDetails(team: Team): string {
  return [team.city, team.abbreviation].filter(Boolean).join(' · ');
}

function EmptyTeams({ categoryId }: { categoryId: string }): ReactElement {
  return (
    <section aria-labelledby="no-teams-title" className="flex flex-col items-start gap-2 p-5">
      <h2 id="no-teams-title" className="font-bold">
        Nenhum time ainda
      </h2>
      <p className="text-sm text-admin-muted">
        Cadastre os times da categoria para montar os grupos e as partidas.
      </p>
      <Link
        href={newTeamPath(categoryId)}
        className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
      >
        Adicionar time
      </Link>
    </section>
  );
}

export function TeamsTab({ categoryId, groups, teams }: TeamsTabProps): ReactElement {
  const sections = buildRosterSections(groups, teams);
  return (
    <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
      {teams.length === 0 ? <EmptyTeams categoryId={categoryId} /> : null}
      {teams.length > 0
        ? sections.map((section) => (
            <section key={section.key} aria-label={section.title}>
              <h2 className="border-b border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted">
                {section.title} · {section.teams.length}
              </h2>
              {section.teams.length === 0 ? (
                <p className="px-4 py-3 text-sm text-admin-muted">Nenhum time neste grupo.</p>
              ) : (
                <ul className="divide-y divide-admin-line">
                  {section.teams.map((team) => (
                    <li key={team.id}>
                      <Link
                        href={teamPath(team.id)}
                        className="flex min-h-14 items-center justify-between gap-3 px-4 hover:bg-admin-canvas"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-semibold text-brand-700">{team.name}</span>
                          <span className="truncate text-sm text-admin-muted">
                            {teamDetails(team)}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-admin-muted">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))
        : null}
    </div>
  );
}
