import type { Metadata } from 'next';
import { AdminLinksSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { GalleryHomeLoader } from '@/features/admin-gallery/components/GalleryHomeLoader';

export const metadata: Metadata = { title: 'Galeria' };

export default function AdminGalleryPage(): ReactElement {
  return (
    <Suspense fallback={<AdminLinksSkeleton label="Carregando a galeria" />}>
      <GalleryHomeLoader />
    </Suspense>
  );
}
