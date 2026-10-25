import Link from 'next/link';
import type { ReactElement } from 'react';
import type { MatchGroup } from '@/features/admin-teams/types';
import { groupFixturesPath } from '../lib/suggestion-paths';

interface GroupFixtureLinksProps {
  categoryId: string;
  groups: MatchGroup[];
}

export function GroupFixtureLinks({
  categoryId,
  groups,
}: GroupFixtureLinksProps): ReactElement | null {
  if (groups.length === 0) {
    return null;
  }
  return (
    <section
      aria-label="Sugestão de jogos da fase de grupos"
      className="flex flex-col gap-3 rounded-2xl border border-admin-line bg-admin-surface p-4"
    >
      <p className="text-sm text-admin-muted">
        Gere uma sugestão de todos contra todos para um grupo. Você revisa antes de criar.
      </p>
      <ul className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <li key={group.id}>
            <Link
              href={groupFixturesPath(categoryId, group.id)}
              className="inline-flex min-h-12 items-center rounded-xl border border-admin-line bg-admin-canvas px-5 font-semibold hover:border-brand-500"
            >
              Sugerir jogos do Grupo {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
