import type { ReactElement } from 'react';
import { Skeleton } from '@/components/loading/Skeleton';

const PLACEHOLDER_COUNT = 3;

export function SubEventSkeleton(): ReactElement {
  return (
    <ul aria-hidden="true" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <li key={index} className="flex h-36 flex-col gap-3 rounded-3xl bg-white/10 p-6">
          <Skeleton tone="dark" className="h-8 w-32 rounded-full" />
          <Skeleton tone="dark" className="h-5 w-3/4 rounded-full" />
          <Skeleton tone="dark" className="h-4 w-1/2 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
