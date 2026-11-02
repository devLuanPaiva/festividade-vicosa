import Link from 'next/link';
import type { ReactElement } from 'react';
import {
  STATUS_FILTERS,
  buildUserListHref,
  type UserListQuery,
  type UserStatusFilter,
} from '../../lib/user-list-query';
import type { AdminRole } from '../../types';

const STATUS_LABELS: Record<UserStatusFilter, string> = {
  todos: 'Todos',
  ativos: 'Ativos',
  inativos: 'Inativos',
};

interface UserFiltersProps {
  query: UserListQuery;
  roles: AdminRole[];
}

interface ChipProps {
  href: string;
  label: string;
  isSelected: boolean;
}

function Chip({ href, label, isSelected }: ChipProps): ReactElement {
  return (
    <Link
      href={href}
      aria-current={isSelected ? 'true' : undefined}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold ${
        isSelected
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-admin-line bg-white hover:border-brand-500'
      }`}
    >
      {label}
    </Link>
  );
}

export function UserFilters({ query, roles }: UserFiltersProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label="Situação" className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <Chip
            key={status}
            href={buildUserListHref(query, { status })}
            label={STATUS_LABELS[status]}
            isSelected={query.status === status}
          />
        ))}
      </div>
      <div role="group" aria-label="Grupo" className="flex flex-wrap gap-2">
        <Chip
          href={buildUserListHref(query, { roleId: '' })}
          label="Todos os grupos"
          isSelected={query.roleId === ''}
        />
        {roles.map((role) => (
          <Chip
            key={role.id}
            href={buildUserListHref(query, { roleId: role.id })}
            label={role.name}
            isSelected={query.roleId === role.id}
          />
        ))}
      </div>
    </div>
  );
}
