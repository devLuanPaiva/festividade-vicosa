import { useEffect, useRef, type RefObject } from 'react';

interface MobileDrawer {
  dialogRef: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
}

export function useMobileDrawer(pathname: string): MobileDrawer {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (): void => dialogRef.current?.showModal();
  const close = (): void => dialogRef.current?.close();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return { dialogRef, open, close };
}
