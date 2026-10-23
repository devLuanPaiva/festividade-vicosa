const TIME_ZONE = 'America/Fortaleza';
const LOCALE = 'pt-BR';

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

const dayHeadingFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
});

export function toDayKey(isoDate: string): string {
  return dayKeyFormat.format(new Date(isoDate));
}

export function formatDayHeading(isoDate: string): string {
  return dayHeadingFormat.format(new Date(isoDate));
}

export function formatMatchTime(isoDate: string): string {
  return timeFormat.format(new Date(isoDate));
}
