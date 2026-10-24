import Link from 'next/link';
import { Suspense, type ReactElement, type ReactNode } from 'react';
import { AdminHeader } from '@/features/admin-shell/components/AdminHeader';

interface AdminPanelLayoutProps {
  children: ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps): ReactElement {
  return (
    <div className="mx-auto flex min-h-dvh w-[90%] max-w-2xl flex-col gap-6 py-6">
      <header className="flex flex-col gap-3">
        <Link href="/admin" className="font-display text-2xl tracking-wide text-brand-600">
          Painel da Festividade
        </Link>
        <Suspense fallback={<div className="h-11" />}>
          <AdminHeader />
        </Suspense>
      </header>
      <main className="flex flex-1 flex-col gap-6 pb-10">{children}</main>
    </div>
  );
}
