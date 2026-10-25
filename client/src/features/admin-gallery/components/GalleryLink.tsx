import Link from 'next/link';
import type { ReactElement } from 'react';

interface GalleryLinkProps {
  href: string;
  title: string;
  detail: string;
}

export function GalleryLink({ href, title, detail }: GalleryLinkProps): ReactElement {
  return (
    <Link
      href={href}
      className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-admin-line bg-admin-surface px-4 transition-colors hover:border-brand-500"
    >
      <span className="flex flex-col">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-admin-muted">{detail}</span>
      </span>
      <span aria-hidden="true" className="text-admin-muted">
        ›
      </span>
    </Link>
  );
}
