import type { DemoSport } from './demo-photos';
import type { DemoProgress } from './demo-types';

const PROGRESS_BY_CATEGORY: Record<DemoSport, Record<string, DemoProgress>> = {
  HANDBALL: {
    'Adulto Masculino': 'FINISHED',
    'Adulto Feminino': 'BRACKET_READY',
    'Sub-18 Feminino': 'GROUPS_DONE',
    'Cadete Masculino': 'PARTIAL',
    'Sub-18 Masculino': 'PARTIAL',
  },
  FUTSAL: {
    Adulto: 'FINISHED',
    'Sub-18': 'GROUPS_DONE',
    'Sub-15': 'PARTIAL',
  },
};

export const WALKOVER_CATEGORIES = new Set(['HANDBALL:Cadete Masculino']);

export function resolveProgress(sport: DemoSport, categoryName: string): DemoProgress {
  return PROGRESS_BY_CATEGORY[sport][categoryName] ?? 'SCHEDULED';
}

export function isFirstShootoutCategory(sport: DemoSport, categoryName: string): boolean {
  return sport === 'FUTSAL' && categoryName === 'Adulto';
}
