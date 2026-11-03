import Link from 'next/link';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';

export function AdminNotFound(): ReactElement {
  return (
    <EmptyState
      tone="admin"
      icon="search"
      title="Página não encontrada"
      description="Este endereço não existe ou o item foi removido. Volte ao início do painel e siga pelo menu."
    >
      <Link
        href={ADMIN_HOME_PATH}
        className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
      >
        Ir para o início do painel
      </Link>
    </EmptyState>
  );
}
