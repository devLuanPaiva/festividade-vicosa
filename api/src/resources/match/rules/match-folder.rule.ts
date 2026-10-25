const FORTALEZA_TIME_ZONE = 'America/Fortaleza';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: FORTALEZA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export interface MatchFolderInput {
  teamASlug: string;
  teamBSlug: string;
  scheduledAt: Date;
}

function localParts(date: Date): Record<string, string> {
  return Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
}

export function matchFolderName({ teamASlug, teamBSlug, scheduledAt }: MatchFolderInput): string {
  const { year, month, day, hour, minute } = localParts(scheduledAt);
  return `${teamASlug}-x-${teamBSlug}-${year}-${month}-${day}-${hour}${minute}`;
}
