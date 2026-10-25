import type { ReactElement } from 'react';
import { LoadingRegion, Skeleton } from '@/components/loading/Skeleton';

interface AdminSkeletonProps {
  label: string;
  count?: number;
}

function AdminHeaderSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton tone="admin" className="h-4 w-40 rounded-full" />
      <Skeleton tone="admin" className="h-8 w-64 rounded-xl" />
    </div>
  );
}

export function AdminListSkeleton({ label, count = 6 }: AdminSkeletonProps): ReactElement {
  return (
    <LoadingRegion label={label} className="flex flex-col gap-5">
      <AdminHeaderSkeleton />
      <ul className="divide-y divide-admin-line overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="flex items-center gap-3 px-4 py-4">
            <Skeleton tone="admin" className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton tone="admin" className="h-4 w-1/2 rounded-full" />
              <Skeleton tone="admin" className="h-3 w-1/3 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

export function AdminLinksSkeleton({ label, count = 6 }: AdminSkeletonProps): ReactElement {
  return (
    <LoadingRegion label={label} className="flex flex-col gap-5">
      <AdminHeaderSkeleton />
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <Skeleton tone="admin" className="h-16 w-full rounded-xl" />
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

export function AdminFormSkeleton({ label, count = 4 }: AdminSkeletonProps): ReactElement {
  return (
    <LoadingRegion label={label} className="flex flex-col gap-5">
      <AdminHeaderSkeleton />
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton tone="admin" className="h-4 w-32 rounded-full" />
          <Skeleton tone="admin" className="h-12 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton tone="admin" className="h-12 w-full rounded-xl" />
    </LoadingRegion>
  );
}

export function AdminAlbumSkeleton({ label, count = 8 }: AdminSkeletonProps): ReactElement {
  return (
    <LoadingRegion label={label} className="flex flex-col gap-5">
      <AdminHeaderSkeleton />
      <Skeleton tone="admin" className="h-44 w-full rounded-2xl" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <Skeleton tone="admin" className="aspect-square w-full rounded-2xl" />
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}
