import Link from 'next/link';
import type { ReactElement } from 'react';
import { userPath } from '../../lib/user-paths';
import type { AdminUser } from '../../types';
import { UserRoleBadges, UserStatusBadge } from '../UserBadges';

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
}

const HEADER_CLASS =
  'px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-admin-muted';

function UserName({
  user,
  currentUserId,
}: {
  user: AdminUser;
  currentUserId: string;
}): ReactElement {
  return (
    <Link
      href={userPath(user.id)}
      className="font-semibold text-brand-700 after:absolute after:inset-0"
    >
      {user.name}
      {user.id === currentUserId ? (
        <span className="ml-2 text-xs font-normal text-admin-muted">(você)</span>
      ) : null}
    </Link>
  );
}

export function UsersTable({ users, currentUserId }: Readonly<UsersTableProps>): ReactElement {
  return (
    <table className="w-full">
      <caption className="sr-only">Usuários do painel</caption>
      <thead>
        <tr>
          <th scope="col" className={HEADER_CLASS}>
            Nome
          </th>
          <th scope="col" className={`${HEADER_CLASS} hidden md:table-cell`}>
            Grupos
          </th>
          <th scope="col" className={HEADER_CLASS}>
            Situação
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="relative border-t border-admin-line transition-colors hover:bg-admin-canvas"
          >
            <td className="px-4 py-3">
              <UserName user={user} currentUserId={currentUserId} />
              <span className="block text-sm text-admin-muted">{user.email}</span>
              <div className="mt-2 md:hidden">
                <UserRoleBadges roles={user.roles} />
              </div>
            </td>
            <td className="hidden px-4 py-3 md:table-cell">
              <UserRoleBadges roles={user.roles} />
            </td>
            <td className="px-4 py-3">
              <UserStatusBadge active={user.active} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
