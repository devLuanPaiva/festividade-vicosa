export type SubEventType =
  | 'JOCEV_HANDBALL'
  | 'JOCEV_FUTSAL'
  | 'JOCEV_BEACH_VOLLEYBALL'
  | 'CULTURAL_FESTIVAL'
  | 'EMANCIPATION_RUN'
  | 'ECOPEDAL'
  | 'EMANCIPATION_PARTY';

export interface SubEvent {
  id: string;
  editionId: string;
  type: SubEventType;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
}

export interface Edition {
  id: string;
  year: number;
  name: string;
  description: string | null;
}
