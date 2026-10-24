import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LoginForm } from '@/features/admin-auth/components/LoginForm';

export const metadata: Metadata = { title: 'Entrar' };

export default function AdminLoginPage(): ReactElement {
  return (
    <main className="mx-auto flex min-h-dvh w-[90%] max-w-sm flex-col justify-center gap-8 py-10">
      <header className="flex flex-col gap-2">
        <p className="font-display text-2xl tracking-wide text-brand-600">Festividade de Viçosa</p>
        <h1 className="text-2xl font-bold">Entrar no painel</h1>
        <p className="text-sm text-admin-muted">Acesso restrito à equipe da festividade.</p>
      </header>
      <LoginForm />
    </main>
  );
}
