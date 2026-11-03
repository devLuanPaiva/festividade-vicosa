import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { NotFoundView } from '@/components/feedback/NotFoundView';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const metadata: Metadata = { title: 'Página não encontrada' };

export default function GlobalNotFound(): ReactElement {
  return (
    <PublicLayout>
      <NotFoundView />
    </PublicLayout>
  );
}
