import type { MatchesByDay } from '../types';

const TIME_ZONE = 'America/Fortaleza';
const NOON_FORTALEZA = 'T12:00:00-03:00';

const weekdayFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  weekday: 'short',
});

export interface DayColumn {
  date: string;
  weekday: string;
  dayMonth: string;
  finalized: number;
  scheduled: number;
  total: number;
}

function toWeekday(date: string): string {
  return weekdayFormat.format(new Date(`${date}${NOON_FORTALEZA}`)).replace('.', '');
}

function toDayMonth(date: string): string {
  const [, month, day] = date.split('-');
  return `${day}/${month}`;
}

export function buildDayColumns(rows: MatchesByDay[]): DayColumn[] {
  return rows.map(({ date, finalized, scheduled }) => ({
    date,
    weekday: toWeekday(date),
    dayMonth: toDayMonth(date),
    finalized,
    scheduled,
    total: finalized + scheduled,
  }));
}
