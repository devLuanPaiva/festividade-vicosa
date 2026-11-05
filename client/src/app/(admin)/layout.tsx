import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { PANEL_MANIFEST_PATH } from '@/lib/pwa/panel-manifest';

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel JOCEV’S' },
  robots: { index: false, follow: false },
  manifest: PANEL_MANIFEST_PATH,
  appleWebApp: { capable: true, title: 'Painel JOCEV’S', statusBarStyle: 'default' },
};

interface AdminGroupLayoutProps {
  children: ReactNode;
}

export default function AdminGroupLayout({ children }: AdminGroupLayoutProps): ReactElement {
  return <div className="min-h-dvh bg-admin-canvas text-admin-ink">{children}</div>;
}
