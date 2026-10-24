import type { ReactElement } from 'react';

export function GoogleLoginLink(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-3 text-sm text-admin-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-admin-line" />
        ou
        <span className="h-px flex-1 bg-admin-line" />
      </p>
      <a
        href="/admin/login/google"
        className="flex min-h-12 items-center justify-center rounded-xl border border-admin-line bg-white px-6 font-semibold transition-colors hover:border-brand-500"
      >
        Entrar com Google
      </a>
    </div>
  );
}
