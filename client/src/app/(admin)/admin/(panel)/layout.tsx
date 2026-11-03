import { Suspense, type ReactElement, type ReactNode } from 'react';
import { AdminShell } from '@/features/admin-shell/components/AdminShell';

interface AdminPanelLayoutProps {
  children: ReactNode;
}

function ShellFallback(): ReactElement {
  return (
    <p className="grid min-h-dvh place-items-center text-sm text-admin-muted">Carregando painel…</p>
  );
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps): ReactElement {
  return (
    <Suspense fallback={<ShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
