'use client';

import type { ReactElement } from 'react';
import { CountdownUnit } from '@/features/home/components/hero/CountdownUnit';
import { useCountdown } from '@/features/home/hooks/useCountdown';
import type { Countdown } from '@/features/home/lib/countdown';

const EMPTY_VALUE = '--';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function countdownUnits(countdown: Countdown | null): { label: string; value: string }[] {
  const read = (value: number | undefined): string =>
    value === undefined ? EMPTY_VALUE : pad(value);
  return [
    { label: 'dias', value: read(countdown?.days) },
    { label: 'horas', value: read(countdown?.hours) },
    { label: 'min', value: read(countdown?.minutes) },
    { label: 'seg', value: read(countdown?.seconds) },
  ];
}

interface LiveCountdownProps {
  startsAt: string;
}

export function LiveCountdown({ startsAt }: Readonly<LiveCountdownProps>): ReactElement | null {
  const countdown = useCountdown(new Date(startsAt));
  if (countdown?.isFinished) {
    return null;
  }
  return (
    <div>
      <p className="text-sm font-medium text-white/90">A transmissão começa em</p>
      <div className="mt-3 grid max-w-md grid-cols-4 gap-2 text-white sm:gap-3">
        {countdownUnits(countdown).map(({ label, value }) => (
          <CountdownUnit key={label} value={value} label={label} />
        ))}
      </div>
    </div>
  );
}
