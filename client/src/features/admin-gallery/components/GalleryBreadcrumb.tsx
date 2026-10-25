import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_GALLERY_PATH } from '@/features/admin-shell/lib/admin-sections';
import { subEventGalleryPath } from '../lib/admin-gallery-paths';

interface GalleryBreadcrumbProps {
  subEvent?: { id: string; name: string };
  title: string;
}

export function GalleryBreadcrumb({ subEvent, title }: GalleryBreadcrumbProps): ReactElement {
  return (
    <header className="flex flex-col gap-2">
      <nav aria-label="Você está em" className="text-sm text-admin-muted">
        <Link
          href={ADMIN_GALLERY_PATH}
          className="inline-flex min-h-11 items-center font-semibold text-brand-700"
        >
          Galeria
        </Link>
        {subEvent ? (
          <>
            {' '}
            <span aria-hidden="true">›</span>{' '}
            <Link
              href={subEventGalleryPath(subEvent.id)}
              className="inline-flex min-h-11 items-center font-semibold text-brand-700"
            >
              {subEvent.name}
            </Link>
          </>
        ) : null}
      </nav>
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
