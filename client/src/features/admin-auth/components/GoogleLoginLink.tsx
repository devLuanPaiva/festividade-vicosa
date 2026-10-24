'use client';

import { useEffect, useState, type MouseEvent, type ReactElement } from 'react';

export function GoogleLoginLink(): ReactElement {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const restoreAfterBack = (event: PageTransitionEvent): void => {
      if (event.persisted) {
        setIsRedirecting(false);
      }
    };
    window.addEventListener('pageshow', restoreAfterBack);
    return () => window.removeEventListener('pageshow', restoreAfterBack);
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (isRedirecting) {
      event.preventDefault();
      return;
    }
    setIsRedirecting(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-3 text-sm text-admin-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-admin-line" />
        ou
        <span className="h-px flex-1 bg-admin-line" />
      </p>
      <a
        href="/admin/login/google"
        onClick={handleClick}
        aria-disabled={isRedirecting}
        className={`flex min-h-12 items-center justify-center rounded-xl border border-admin-line bg-white px-6 font-semibold transition-colors hover:border-brand-500 ${isRedirecting ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {isRedirecting ? 'Redirecionando…' : 'Entrar com Google'}
      </a>
    </div>
  );
}
