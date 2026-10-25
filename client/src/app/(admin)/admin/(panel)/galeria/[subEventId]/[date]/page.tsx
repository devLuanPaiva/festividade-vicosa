import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { AlbumLoader } from '@/features/admin-gallery/components/AlbumLoader';

export const metadata: Metadata = { title: 'Álbum do dia' };

interface AlbumRouteProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export default function AlbumRoute({ params }: AlbumRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando o álbum…</p>}>
      <AlbumLoader params={params} />
    </Suspense>
  );
}
