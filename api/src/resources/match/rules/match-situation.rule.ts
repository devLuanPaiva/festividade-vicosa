import { dayRangeInFortaleza, type DayRange } from '../../indicator/rules/indicator-math.rule';

export enum MatchSituation {
  TODAY = 'today',
  OVERDUE = 'overdue',
  SCHEDULED = 'scheduled',
  FINALIZED = 'finalized',
}

export interface SituationCounts {
  total: number;
  today: number;
  overdue: number;
  scheduled: number;
  finalized: number;
}

const NOON_IN_FORTALEZA = 'T12:00:00-03:00';
const ACCENTED_LETTERS = 'áàâãäéèêëíìîïóòôõöúùûüç';
const PLAIN_LETTERS = 'aaaaaeeeeiiiiooooouuuuc';
const DIACRITICS = /[̀-ͯ]/g;

export function dayWindow(day: string): DayRange {
  return dayRangeInFortaleza(new Date(`${day}${NOON_IN_FORTALEZA}`));
}

export function todayWindow(now: Date): DayRange {
  return dayRangeInFortaleza(now);
}

export function normalizeSearchTerm(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim();
}

export function normalizedSql(expression: string): string {
  return `translate(lower(${expression}), '${ACCENTED_LETTERS}', '${PLAIN_LETTERS}')`;
}
