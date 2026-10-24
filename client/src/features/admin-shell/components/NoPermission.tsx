import type { ReactElement } from 'react';

interface NoPermissionProps {
  action: string;
}

export function NoPermission({ action }: NoPermissionProps): ReactElement {
  return (
    <section aria-labelledby="no-permission-title" className="flex flex-col gap-2">
      <h2 id="no-permission-title" className="text-lg font-bold">
        Você não tem acesso a esta área
      </h2>
      <p className="text-sm text-admin-muted">
        Seu usuário não tem permissão para {action}. Fale com o administrador para liberar.
      </p>
    </section>
  );
}
