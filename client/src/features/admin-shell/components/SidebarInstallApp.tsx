import type { ReactElement } from 'react';
import { InstallAppButton } from '@/components/pwa/InstallAppButton';
import { Icon } from '@/components/ui/Icon';
import { Tooltip } from '@/components/ui/Tooltip';

const LABEL = 'Instalar o app';

interface SidebarInstallAppProps {
  isCollapsed: boolean;
}

export function SidebarInstallApp({ isCollapsed }: Readonly<SidebarInstallAppProps>): ReactElement {
  const layout = isCollapsed ? 'justify-center px-0' : 'px-3';
  return (
    <div className="px-3 pb-3">
      <Tooltip label={LABEL} side="right" isDisabled={!isCollapsed} className="w-full">
        <InstallAppButton
          className={`flex min-h-11 w-full items-center gap-3 rounded-xl font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white ${layout}`}
        >
          <Icon name="download" className="size-5 shrink-0" />
          <span className={isCollapsed ? 'sr-only' : 'truncate'}>{LABEL}</span>
        </InstallAppButton>
      </Tooltip>
    </div>
  );
}
