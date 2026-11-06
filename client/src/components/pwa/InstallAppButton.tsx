'use client';

import { useRef, type ReactElement, type ReactNode } from 'react';
import { openShareSheet } from '@/lib/pwa/share-to-install';
import { useInstallApp } from '@/lib/pwa/use-install-app';
import { InstallInstructionsDialog } from './InstallInstructionsDialog';

interface InstallAppButtonProps {
  className: string;
  children: ReactNode;
}

export function InstallAppButton({
  className,
  children,
}: InstallAppButtonProps): ReactElement | null {
  const { status, platform, install } = useInstallApp();
  const dialogRef = useRef<HTMLDialogElement>(null);
  if (status === 'checking' || status === 'installed') {
    return null;
  }
  const showSteps = (): void => {
    dialogRef.current?.showModal();
  };
  const handleClick = (): void => {
    if (status === 'promptable') {
      void install();
      return;
    }
    if (platform !== 'ios') {
      showSteps();
      return;
    }
    void openShareSheet({ title: document.title, url: window.location.href }).then((opened) => {
      if (!opened) {
        showSteps();
      }
    });
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
