import { useSyncExternalStore } from 'react';
import { getCountdown, type Countdown } from './countdown';

const TICK_IN_MILLISECONDS = 1000;

function subscribeToTicks(onTick: () => void): () => void {
  const intervalId = setInterval(onTick, TICK_IN_MILLISECONDS);
  return () => clearInterval(intervalId);
}

function readCurrentSecond(): number {
  return Math.floor(Date.now() / TICK_IN_MILLISECONDS);
}

function readServerSecond(): null {
  return null;
}

export function useCountdown(target: Date): Countdown | null {
  const currentSecond = useSyncExternalStore(subscribeToTicks, readCurrentSecond, readServerSecond);
  if (currentSecond === null) {
    return null;
  }
  return getCountdown(target, currentSecond * TICK_IN_MILLISECONDS);
}
