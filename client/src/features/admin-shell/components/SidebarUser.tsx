import type { ReactElement } from 'react';
import { IconSubmitButton } from '@/components/ui/IconSubmitButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { logoutAction } from '@/features/admin-auth/actions/logout-action';
import { toInitials } from '../lib/user-initials';
import type { ShellUser } from '../types';

interface SidebarUserProps {
  user: ShellUser;
  isCollapsed: boolean;
}

export function SidebarUser({ user, isCollapsed }: SidebarUserProps): ReactElement {
  const layout = isCollapsed ? 'flex-col' : 'items-center';
  return (
    <div className={`flex gap-2 border-t border-white/10 p-3 ${layout}`}>
      <Tooltip label={user.name} side="right" isDisabled={!isCollapsed}>
        <span
          aria-hidden={!isCollapsed}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun text-sm font-bold text-brand-900"
        >
          {toInitials(user.name)}
        </span>
      </Tooltip>
      {isCollapsed ? null : (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-white">{user.name}</span>
          <span className="truncate text-xs text-white/65">{user.email}</span>
        </span>
      )}
      <form action={logoutAction}>
        <IconSubmitButton
          icon="logout"
          label="Sair do painel"
          className="text-white/75 hover:bg-white/10 hover:text-white"
        />
      </form>
    </div>
  );
}
