'use client';

import type { ReactElement } from 'react';
import { FIRST_GAME_AT } from '../../lib/countdown';
import { useCountdown } from '../../hooks/useCountdown';
import { CountdownUnit } from './CountdownUnit';

const EMPTY_VALUE = '--';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function CountdownPanel(): ReactElement {
  const countdown = useCountdown(FIRST_GAME_AT);

  return (
    <div>
      <p className="text-sm font-medium text-white/90">
        Faltam para o primeiro jogo, dia 4 de dezembro
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        <CountdownUnit value={countdown ? pad(countdown.days) : EMPTY_VALUE} label="dias" />
        <CountdownUnit value={countdown ? pad(countdown.hours) : EMPTY_VALUE} label="horas" />
        <CountdownUnit value={countdown ? pad(countdown.minutes) : EMPTY_VALUE} label="min" />
        <CountdownUnit value={countdown ? pad(countdown.seconds) : EMPTY_VALUE} label="seg" />
      </div>
    </div>
  );
}
