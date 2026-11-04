export enum CourtLocation {
  SQUARE_1 = 'SQUARE_1',
  SQUARE_2 = 'SQUARE_2',
  GYMNASIUM = 'GYMNASIUM',
}

export const COURT_LOCATION_LABELS: Record<CourtLocation, string> = {
  [CourtLocation.SQUARE_1]: 'Praça 1',
  [CourtLocation.SQUARE_2]: 'Praça 2',
  [CourtLocation.GYMNASIUM]: 'Ginásio',
};
