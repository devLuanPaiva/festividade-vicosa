const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

interface DateParts {
  day: number;
  month: string;
}

function parseDateParts(isoDate: string): DateParts {
  const [, month = '1', day = '1'] = isoDate.split('-');
  return { day: Number(day), month: MONTH_NAMES[Number(month) - 1] ?? '' };
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseDateParts(startDate);
  const end = parseDateParts(endDate);

  if (startDate === endDate) {
    return `${start.day} de ${start.month}`;
  }
  if (start.month === end.month) {
    return `${start.day} a ${end.day} de ${end.month}`;
  }
  return `${start.day} de ${start.month} a ${end.day} de ${end.month}`;
}
