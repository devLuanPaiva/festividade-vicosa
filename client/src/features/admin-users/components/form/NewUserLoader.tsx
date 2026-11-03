import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getRoles } from '../../services/get-roles';
import { NewUserForm } from './NewUserForm';

export async function NewUserLoader(): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const roles = await getRoles(access.token);
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href={ADMIN_USERS_PATH}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700"
        >
          ← Voltar aos usuários
        </Link>
        <h1 className="text-2xl font-bold">Novo usuário</h1>
      </header>
      <NewUserForm roles={roles} />
    </>
  );
}
