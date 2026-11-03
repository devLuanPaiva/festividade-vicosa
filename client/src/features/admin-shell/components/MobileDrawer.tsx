'use client';

import type { MouseEvent, ReactElement, RefObject } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import type { ShellUser } from '../types';
import { SidebarContent } from './SidebarContent';

interface MobileDrawerProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  user: ShellUser;
  onClose: () => void;
}

export function MobileDrawer({ dialogRef, user, onClose }: MobileDrawerProps): ReactElement {
  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menu de navegação"
      onClick={closeOnBackdropClick}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-brand-900 p-0 text-white backdrop:bg-black/55 md:hidden"
    >
      <SidebarContent
        user={user}
        isCollapsed={false}
        onNavigate={onClose}
        headerAction={
          <div className="pr-2">
            <IconButton
              icon="close"
              label="Fechar menu"
              onClick={onClose}
              className="text-white/75 hover:bg-white/10 hover:text-white"
            />
          </div>
        }
      />
    </dialog>
  );
}
