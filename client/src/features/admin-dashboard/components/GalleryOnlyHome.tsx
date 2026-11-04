import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_GALLERY_PATH } from '@/features/admin-shell/lib/admin-sections';

interface GalleryOnlyHomeProps {
  firstName: string;
}

export function GalleryOnlyHome({ firstName }: GalleryOnlyHomeProps): ReactElement {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Olá, {firstName}</h1>
        <p className="text-sm text-admin-muted">
          Envie e organize as fotos de cada sub-evento da festividade.
        </p>
      </header>
      <Link
        href={ADMIN_GALLERY_PATH}
        className="inline-flex min-h-12 w-fit items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
      >
        Ir para a galeria
      </Link>
    </>
  );
}
