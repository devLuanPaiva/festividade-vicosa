import type { ReactElement, ReactNode } from 'react';

export type SkeletonTone = 'light' | 'dark' | 'admin';

const TONE_CLASSES: Record<SkeletonTone, string> = {
  light: '',
  dark: 'skeleton-dark',
  admin: 'skeleton-admin',
};

interface SkeletonProps {
  className?: string;
  tone?: SkeletonTone;
}

export function Skeleton({ className = '', tone = 'light' }: SkeletonProps): ReactElement {
  return <div aria-hidden="true" className={`skeleton ${TONE_CLASSES[tone]} ${className}`} />;
}

interface LoadingRegionProps {
  label: string;
  className?: string;
  children: ReactNode;
}

export function LoadingRegion({ label, className, children }: LoadingRegionProps): ReactElement {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
