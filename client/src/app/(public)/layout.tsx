import type { ReactElement, ReactNode } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

interface PublicGroupLayoutProps {
  children: ReactNode;
}

export default function PublicGroupLayout({ children }: PublicGroupLayoutProps): ReactElement {
  return <PublicLayout>{children}</PublicLayout>;
}
