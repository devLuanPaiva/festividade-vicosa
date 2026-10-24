import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { GoogleLoginError } from '@/features/admin-auth/components/GoogleLoginError';
import { GoogleLoginLink } from '@/features/admin-auth/components/GoogleLoginLink';
import { LoginForm } from '@/features/admin-auth/components/LoginForm';

export const metadata: Metadata = { title: 'Entrar' };

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps): ReactElement {
  return (
    <main className="mx-auto flex min-h-dvh w-[90%] max-w-sm flex-col justify-center gap-8 py-10">
      <header className="flex flex-col gap-2">
        <p className="font-display text-2xl tracking-wide text-brand-600">Festividade de Viçosa</p>
        <h1 className="text-2xl font-bold">Entrar no painel</h1>
        <p className="text-sm text-admin-muted">Acesso restrito à equipe da festividade.</p>
      </header>
      <Suspense fallback={null}>
        <GoogleLoginError searchParams={searchParams} />
      </Suspense>
      <LoginForm />
      <GoogleLoginLink />
    </main>
  );
}
