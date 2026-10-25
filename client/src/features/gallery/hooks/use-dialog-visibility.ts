import { useEffect, useRef, type RefObject } from 'react';

export function useDialogVisibility(isVisible: boolean): RefObject<HTMLDialogElement | null> {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (isVisible && !dialog.open) {
      dialog.showModal();
    }
    if (!isVisible && dialog.open) {
      dialog.close();
    }
  }, [isVisible]);

  return dialogRef;
}
