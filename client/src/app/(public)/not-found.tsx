import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { NotFoundView } from '@/components/feedback/NotFoundView';

export const metadata: Metadata = { title: 'Página não encontrada' };

export default function PublicNotFound(): ReactElement {
  return <NotFoundView />;
}
