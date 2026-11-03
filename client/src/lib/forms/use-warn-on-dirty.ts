import { useEffect } from 'react';

export function useWarnOnDirty(isDirty: boolean): void {
  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }
    const warn = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);
}
