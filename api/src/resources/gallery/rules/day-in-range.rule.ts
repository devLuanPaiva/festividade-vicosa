export function isDayWithinRange(day: string, startDate: string, endDate: string): boolean {
  return day >= startDate && day <= endDate;
}
