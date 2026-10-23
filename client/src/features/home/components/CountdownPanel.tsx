import type { ReactElement } from 'react';
import { FIRST_GAME_AT } from '../countdown';
import { useCountdown } from '../useCountdown';

const EMPTY_VALUE = '--';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

interface UnitProps {
  value: string;
  label: string;
}

function Unit({ value, label }: UnitProps): ReactElement {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/25">
      <span className="font-display text-5xl leading-none tabular-nums md:text-6xl">{value}</span>
      <span className="mt-1 text-xs font-medium text-white/80">{label}</span>
    </div>
  );
}

export function CountdownPanel(): ReactElement {
  const countdown = useCountdown(FIRST_GAME_AT);

  return (
    <div>
      <p className="text-sm font-medium text-white/90">
        Faltam para o primeiro jogo, dia 4 de dezembro
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        <Unit value={countdown ? pad(countdown.days) : EMPTY_VALUE} label="dias" />
        <Unit value={countdown ? pad(countdown.hours) : EMPTY_VALUE} label="horas" />
        <Unit value={countdown ? pad(countdown.minutes) : EMPTY_VALUE} label="min" />
        <Unit value={countdown ? pad(countdown.seconds) : EMPTY_VALUE} label="seg" />
      </div>
    </div>
  );
}
