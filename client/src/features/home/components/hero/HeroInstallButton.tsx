import type { ReactElement } from 'react';
import { InstallAppButton } from '@/components/pwa/InstallAppButton';
import { Icon } from '@/components/ui/Icon';

const CLASS_NAME =
  'inline-flex md:hidden min-h-12 items-center justify-center gap-2 rounded-full px-7 font-semibold text-white ring-2 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-900 active:translate-y-0';

export function HeroInstallButton(): ReactElement {
  return (
    <InstallAppButton className={CLASS_NAME}>
      <Icon name="download" />
      Baixar o app
    </InstallAppButton>
  );
}
