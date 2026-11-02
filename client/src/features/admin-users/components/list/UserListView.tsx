import Link from 'next/link';
import type { ReactElement } from 'react';
import { ListSearch } from '@/features/admin-shell/components/ListSearch';
import { PaginationBar } from '@/features/admin-shell/components/PaginationBar';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { Page } from '@/lib/pagination/paginate';
import { buildUserListHref, type UserListQuery } from '../../lib/user-list-query';
import { NEW_USER_PATH } from '../../lib/user-paths';
import type { AdminRole, AdminUser } from '../../types';
import { UsersAreaTabs } from '../UsersAreaTabs';
import { UserFilters } from './UserFilters';
import { UsersTable } from './UsersTable';

interface UserListViewProps {
  query: UserListQuery;
  page: Page<AdminUser>;
  roles: AdminRole[];
  currentUserId: string;
}

const NOUN = { singular: 'usuário', plural: 'usuários' };

function hasFilters(query: UserListQuery): boolean {
  return query.search !== '' || query.status !== 'todos' || query.roleId !== '';
}

function searchFields(query: UserListQuery): { name: string; value: string }[] {
  return [
    ...(query.status === 'todos' ? [] : [{ name: 'situacao', value: query.status }]),
    ...(query.roleId ? [{ name: 'grupo', value: query.roleId }] : []),
  ];
}

export function UserListView({
  query,
  page,
  roles,
  currentUserId,
}: UserListViewProps): ReactElement {
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Usuários e acessos</h1>
          <p className="text-sm text-admin-muted">
            Quem acessa o painel, a quais grupos pertence e o que pode fazer.
          </p>
        </div>
        <Link
          href={NEW_USER_PATH}
          className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
        >
          Novo usuário
        </Link>
      </header>
      <UsersAreaTabs active="users" />
      <ListSearch
        action={ADMIN_USERS_PATH}
        inputId="user-search"
        placeholder="Nome ou e-mail"
        defaultValue={query.search}
        fields={searchFields(query)}
      />
      <UserFilters query={query} roles={roles} />
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {page.total === 0 ? (
          <p className="p-6 text-sm text-admin-muted">
            {hasFilters(query)
              ? 'Nenhum usuário encontrado com esses filtros.'
              : 'Nenhum usuário cadastrado.'}
          </p>
        ) : (
          <UsersTable users={page.items} currentUserId={currentUserId} />
        )}
        <PaginationBar
          page={page.page}
          totalPages={page.totalPages}
          total={page.total}
          pageSize={query.pageSize}
          noun={NOUN}
          hrefFor={(changes) => buildUserListHref(query, changes)}
        />
      </div>
    </>
  );
}
