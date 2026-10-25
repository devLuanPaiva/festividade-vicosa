const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function toIsoDay(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function eachDay(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const last = Date.parse(`${endDate}T00:00:00Z`);
  for (let current = Date.parse(`${startDate}T00:00:00Z`); current <= last;) {
    days.push(toIsoDay(current));
    current += ONE_DAY_IN_MILLISECONDS;
  }
  return days;
}
