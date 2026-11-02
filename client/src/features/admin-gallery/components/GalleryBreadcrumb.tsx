import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_GALLERY_PATH } from '@/features/admin-shell/lib/admin-sections';

export interface Crumb {
  label: string;
  href: string;
}

interface GalleryBreadcrumbProps {
  crumbs?: Crumb[];
  title: string;
}

const GALLERY_CRUMB: Crumb = { label: 'Galeria', href: ADMIN_GALLERY_PATH };

export function GalleryBreadcrumb({ crumbs = [], title }: GalleryBreadcrumbProps): ReactElement {
  return (
    <header className="flex flex-col gap-2">
      <nav aria-label="Você está em" className="flex flex-wrap items-center text-sm">
        {[GALLERY_CRUMB, ...crumbs].map((crumb, index) => (
          <span key={crumb.href} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-1 text-admin-muted">
                ›
              </span>
            ) : null}
            <Link
              href={crumb.href}
              className="inline-flex min-h-11 items-center font-semibold text-brand-700"
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
