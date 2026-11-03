import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { NEW_ROLE_PATH, rolePath } from '../../lib/user-paths';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getRoles } from '../../services/get-roles';
import { UsersAreaTabs } from '../UsersAreaTabs';

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export async function RoleListLoader(): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const roles = await getRoles(access.token);
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Grupos</h1>
          <p className="text-sm text-admin-muted">
            Cada grupo é um pacote de permissões. Um usuário pode estar em vários grupos.
          </p>
        </div>
        {access.canManagePermissions ? (
          <Link
            href={NEW_ROLE_PATH}
            className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
          >
            Novo grupo
          </Link>
        ) : null}
      </header>
      <UsersAreaTabs active="roles" />
      <ul className="grid gap-3 md:grid-cols-2">
        {roles.map((role) => (
          <li
            key={role.id}
            className="relative flex flex-col gap-2 rounded-2xl border border-admin-line bg-admin-surface p-4 transition-colors hover:border-brand-500"
          >
            <Link
              href={rolePath(role.id)}
              className="font-bold text-brand-700 after:absolute after:inset-0"
            >
              {role.name}
            </Link>
            <p className="text-sm text-admin-muted">
              {countLabel(role.permissions.length, 'permissão', 'permissões')} ·{' '}
              {countLabel(role.userCount, 'usuário', 'usuários')}
              {role.system ? ' · grupo padrão' : ''}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
