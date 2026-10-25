import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AdminNotFound } from '@/features/admin-shell/components/AdminNotFound';

export const metadata: Metadata = { title: 'Página não encontrada' };

export default function PanelNotFound(): ReactElement {
  return <AdminNotFound />;
}
