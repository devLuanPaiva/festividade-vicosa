import type { ReactElement } from 'react';

const PLACEHOLDER_COUNT = 3;

export function SubEventSkeleton(): ReactElement {
  return (
    <ul aria-hidden="true" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <li key={index} className="h-36 animate-pulse rounded-3xl bg-white/15" />
      ))}
    </ul>
  );
}
