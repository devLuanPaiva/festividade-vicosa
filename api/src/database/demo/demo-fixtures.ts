import { requireAt } from './demo-array';

const START_HOUR = 8;
const LAST_START_HOUR = 21;
const SLOT_MINUTES = 45;
const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_DAY = 86_400_000;
const BRAZIL_OFFSET = '-03:00';

export interface Pairing {
  teamAId: string;
  teamBId: string;
}

export interface Slot {
  scheduledAt: string;
  location: string;
}

function rotate(teamIds: string[]): string[] {
  const first = requireAt(teamIds, 0);
  const others = teamIds.slice(1);
  const last = requireAt(others, others.length - 1);
  return [first, last, ...others.slice(0, -1)];
}

export function roundRobinRounds(teamIds: string[]): Pairing[][] {
  const participants = teamIds.length % 2 === 0 ? [...teamIds] : [...teamIds, ''];
  const rounds: Pairing[][] = [];
  let current = participants;
  for (let round = 0; round < participants.length - 1; round++) {
    rounds.push(pairUp(current));
    current = rotate(current);
  }
  return rounds;
}

function pairUp(participants: string[]): Pairing[] {
  const pairings: Pairing[] = [];
  const half = participants.length / 2;
  for (let index = 0; index < half; index++) {
    const teamAId = requireAt(participants, index);
    const teamBId = requireAt(participants, participants.length - 1 - index);
    if (teamAId && teamBId) {
      pairings.push({ teamAId, teamBId });
    }
  }
  return pairings;
}

function slotTimes(): string[] {
  const times: string[] = [];
  for (
    let minutes = START_HOUR * MINUTES_PER_HOUR;
    minutes <= LAST_START_HOUR * MINUTES_PER_HOUR;
    minutes += SLOT_MINUTES
  ) {
    const hours = String(Math.floor(minutes / MINUTES_PER_HOUR)).padStart(2, '0');
    const rest = String(minutes % MINUTES_PER_HOUR).padStart(2, '0');
    times.push(`${hours}:${rest}:00`);
  }
  return times;
}

export function addDays(isoDate: string, days: number): string {
  const shifted = new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * MILLISECONDS_PER_DAY);
  return shifted.toISOString().slice(0, 10);
}

export function toBrazilDateTime(isoDate: string, time: string): string {
  return `${isoDate}T${time}${BRAZIL_OFFSET}`;
}

export function buildSlots(firstDate: string, venues: string[], count: number): Slot[] {
  const times = slotTimes();
  const slotsPerDay = times.length * venues.length;
  return Array.from({ length: count }, (_, index) => {
    const day = Math.floor(index / slotsPerDay);
    const withinDay = index % slotsPerDay;
    const time = requireAt(times, Math.floor(withinDay / venues.length));
    const location = requireAt(venues, withinDay % venues.length);
    return { scheduledAt: toBrazilDateTime(addDays(firstDate, day), time), location };
  });
}
