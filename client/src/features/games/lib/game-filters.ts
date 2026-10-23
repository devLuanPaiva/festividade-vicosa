import type { SubEvent, SubEventType } from '@/features/schedule/types';
import type { MatchStatus } from '../types';

export type ModalitySlug = 'futsal' | 'handebol';
export type MatchScope = 'proximos' | 'finalizados';
export type SearchParams = Record<string, string | string[] | undefined>;

export interface GameFilterParams {
  modality?: ModalitySlug;
  categoryId?: string;
  scope: MatchScope;
}

export interface Modality {
  slug: ModalitySlug;
  label: string;
  type: SubEventType;
}

export const MODALITIES: Modality[] = [
  { slug: 'futsal', label: 'Futsal', type: 'JOCEV_FUTSAL' },
  { slug: 'handebol', label: 'Handebol', type: 'JOCEV_HANDBALL' },
];

export const MATCH_SCOPES: { scope: MatchScope; label: string }[] = [
  { scope: 'proximos', label: 'Próximos' },
  { scope: 'finalizados', label: 'Finalizados' },
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCategoryId(value: string | undefined, hasModality: boolean): string | undefined {
  return hasModality && value && UUID_PATTERN.test(value) ? value : undefined;
}

export function parseGameFilterParams(searchParams: SearchParams): GameFilterParams {
  const modality = MODALITIES.find((item) => item.slug === firstValue(searchParams.modalidade));
  const scope = MATCH_SCOPES.find((item) => item.scope === firstValue(searchParams.jogos));
  return {
    modality: modality?.slug,
    categoryId: parseCategoryId(firstValue(searchParams.categoria), Boolean(modality)),
    scope: scope?.scope ?? 'proximos',
  };
}

export function buildGamesHref(params: GameFilterParams): string {
  const query = new URLSearchParams();
  if (params.modality) {
    query.set('modalidade', params.modality);
  }
  if (params.categoryId) {
    query.set('categoria', params.categoryId);
  }
  query.set('jogos', params.scope);
  return `/jogos?${query.toString()}`;
}

export function statusOfScope(scope: MatchScope): MatchStatus {
  return scope === 'proximos' ? 'SCHEDULED' : 'FINALIZED';
}

export function scopeOfStatus(status: MatchStatus): MatchScope {
  return status === 'SCHEDULED' ? 'proximos' : 'finalizados';
}

export function subEventsOfModality(
  subEvents: SubEvent[],
  modality: ModalitySlug | undefined,
): SubEvent[] {
  const types = new Set(
    MODALITIES.filter((item) => !modality || item.slug === modality).map((item) => item.type),
  );
  return subEvents.filter((subEvent) => types.has(subEvent.type));
}
