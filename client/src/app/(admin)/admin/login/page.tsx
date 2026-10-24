import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { GoogleLoginError } from '@/features/admin-auth/components/GoogleLoginError';
import { GoogleLoginLink } from '@/features/admin-auth/components/GoogleLoginLink';
import { LoginBrandPanel } from '@/features/admin-auth/components/LoginBrandPanel';
import { LoginForm } from '@/features/admin-auth/components/LoginForm';

export const metadata: Metadata = { title: 'Entrar' };

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps): ReactElement {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <LoginBrandPanel />
      <section className="-mt-8 flex flex-1 items-start justify-center rounded-t-3xl bg-admin-canvas px-4 pb-10 pt-8 lg:mt-0 lg:items-center lg:rounded-none lg:px-10 lg:py-16">
        <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-admin-line bg-admin-surface p-6 shadow-sm sm:p-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-sm text-admin-muted">
              Entre para lançar resultados e acompanhar o campeonato.
            </p>
          </header>
          <Suspense fallback={null}>
            <GoogleLoginError searchParams={searchParams} />
          </Suspense>
          <LoginForm />
          <GoogleLoginLink />
          <p className="text-center text-xs text-admin-muted">
            Acesso restrito à equipe da festividade.
          </p>
        </div>
      </section>
    </main>
  );
}
