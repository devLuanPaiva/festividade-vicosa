const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

export const FIRST_GAME_AT = new Date('2026-12-04T08:00:00-03:00');

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export function getCountdown(target: Date, nowInMilliseconds: number): Countdown {
  const remainingSeconds = Math.max(
    0,
    Math.floor((target.getTime() - nowInMilliseconds) / MILLISECONDS_PER_SECOND),
  );
  const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);

  return {
    days: Math.floor(hours / HOURS_PER_DAY),
    hours: hours % HOURS_PER_DAY,
    minutes: minutes % MINUTES_PER_HOUR,
    seconds: remainingSeconds % SECONDS_PER_MINUTE,
    isFinished: remainingSeconds === 0,
  };
}
