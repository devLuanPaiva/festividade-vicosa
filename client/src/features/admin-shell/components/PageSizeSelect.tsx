'use client';

import { useRouter } from 'next/navigation';
import type { ChangeEvent, ReactElement } from 'react';

export interface PageSizeChoice {
  size: number;
  href: string;
}

interface PageSizeSelectProps {
  current: number;
  choices: PageSizeChoice[];
}

export function PageSizeSelect({ current, choices }: Readonly<PageSizeSelectProps>): ReactElement {
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const choice = choices.find(({ size }) => size === Number(event.target.value));
    if (choice) {
      router.push(choice.href);
    }
  };

  return (
    <label className="flex items-center gap-2 text-sm text-admin-muted">
      <span>Por página</span>
      <select
        value={current}
        onChange={handleChange}
        className="min-h-11 rounded-xl border border-admin-line bg-white px-3 font-semibold"
      >
        {choices.map(({ size }) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
