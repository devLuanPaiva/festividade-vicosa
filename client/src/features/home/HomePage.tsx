import type { ReactElement } from 'react';

export function HomePage(): ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Festividade de Viçosa</h1>
    </main>
  );
}
