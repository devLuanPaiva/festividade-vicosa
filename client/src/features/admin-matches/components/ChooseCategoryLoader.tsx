import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { getAdminCategories } from '@/features/admin-teams/services/get-admin-categories';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { newMatchPath } from '../lib/admin-match-paths';

export async function ChooseCategoryLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:create')) {
    return <NoPermission action="cadastrar partidas" />;
  }
  const modalities = await getAdminCategories();
  return (
    <>
      <header className="flex flex-col gap-2">
        <nav aria-label="Você está em" className="text-sm text-admin-muted">
          <Link href={ADMIN_MATCHES_PATH} className="font-semibold text-brand-700">
            Partidas
          </Link>{' '}
          <span aria-hidden="true">›</span> Nova partida
        </nav>
        <h1 className="text-2xl font-bold">Nova partida</h1>
        <p className="text-sm text-admin-muted">
          Cada categoria é um campeonato próprio. Escolha em qual vai a partida.
        </p>
      </header>
      {modalities.map((modality) => (
        <section key={modality.modalityLabel} className="flex flex-col gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-admin-muted">
            {modality.modalityLabel}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {modality.categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={newMatchPath(category.id)}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-admin-line bg-admin-surface px-4 font-semibold transition-colors hover:border-brand-500"
                >
                  {category.label}
                  <span aria-hidden="true" className="text-admin-muted">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
