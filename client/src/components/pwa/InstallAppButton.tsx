'use client';

import { useRef, type ReactElement, type ReactNode } from 'react';
import { useInstallApp } from '@/lib/pwa/use-install-app';
import { InstallInstructionsDialog } from './InstallInstructionsDialog';

interface InstallAppButtonProps {
  className: string;
  children: ReactNode;
}

export function InstallAppButton({
  className,
  children,
}: Readonly<InstallAppButtonProps>): ReactElement | null {
  const { status, platform, install } = useInstallApp();
  const dialogRef = useRef<HTMLDialogElement>(null);
  if (status === 'checking' || status === 'installed') {
    return null;
  }
  const handleClick = (): void => {
    if (status === 'promptable') {
      void install();
      return;
    }
    dialogRef.current?.showModal();
  };
  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      <InstallInstructionsDialog platform={platform} dialogRef={dialogRef} />
    </>
  );
}
