import type { SelectOption } from '@/components/ui/SelectField';

export const COURT_LOCATIONS = ['SQUARE_1', 'SQUARE_2', 'GYMNASIUM'] as const;

export type CourtLocation = (typeof COURT_LOCATIONS)[number];

const COURT_LOCATION_LABELS: Record<CourtLocation, string> = {
  SQUARE_1: 'Praça 1',
  SQUARE_2: 'Praça 2',
  GYMNASIUM: 'Ginásio',
};

export const UNDEFINED_LOCATION_LABEL = 'A definir';

export const COURT_LOCATION_OPTIONS: SelectOption[] = [
  { value: '', label: UNDEFINED_LOCATION_LABEL },
  ...COURT_LOCATIONS.map((location) => ({
    value: location,
    label: COURT_LOCATION_LABELS[location],
  })),
];

export function courtLocationLabel(location: CourtLocation | null): string | null {
  return location ? COURT_LOCATION_LABELS[location] : null;
}

export function parseCourtLocation(value: string): CourtLocation | null {
  return COURT_LOCATIONS.find((location) => location === value) ?? null;
}
