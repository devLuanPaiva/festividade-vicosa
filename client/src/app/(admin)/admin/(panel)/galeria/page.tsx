import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { GalleryHomeLoader } from '@/features/admin-gallery/components/GalleryHomeLoader';

export const metadata: Metadata = { title: 'Galeria' };

export default function AdminGalleryPage(): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando a galeria…</p>}>
      <GalleryHomeLoader />
    </Suspense>
  );
}
