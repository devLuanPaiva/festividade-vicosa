import type { ReactElement } from 'react';
import type { UserRoleSummary } from '../types';

const PILL_CLASS =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold';

export function UserStatusBadge({ active }: { active: boolean }): ReactElement {
  const tone = active ? 'bg-success/10 text-success' : 'bg-admin-canvas text-admin-muted';
  return (
    <span className={`${PILL_CLASS} ${tone}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}

export function UserRoleBadges({ roles }: { roles: UserRoleSummary[] }): ReactElement {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <li
          key={role.id}
          className={`${PILL_CLASS} ${
            role.primary ? 'bg-brand-600 text-white' : 'border border-admin-line text-admin-ink'
          }`}
        >
          {role.name}
          {role.primary ? <span className="sr-only"> (principal)</span> : null}
        </li>
      ))}
    </ul>
  );
}
