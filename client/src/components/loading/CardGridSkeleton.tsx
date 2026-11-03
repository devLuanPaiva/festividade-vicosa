import type { ReactElement } from 'react';
import { Skeleton } from './Skeleton';

interface CardGridSkeletonProps {
  count?: number;
  withImage?: boolean;
}

export function CardGridSkeleton({
  count = 6,
  withImage = false,
}: CardGridSkeletonProps): ReactElement {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(7,59,134,0.12)]"
        >
          {withImage ? <Skeleton className="aspect-4/3 w-full" /> : null}
          <div className="flex flex-col gap-3 p-5">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-6 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PhotoGridSkeleton({ count = 8 }: { count?: number }): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </li>
      ))}
    </ul>
  );
}
