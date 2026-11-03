import type { Gender, Match, MatchRound } from '../types';

const ROUND_LABELS: Record<MatchRound, string> = {
  ROUND_OF_32: '16 avos de final',
  ROUND_OF_16: 'Oitavas de final',
  QUARTER_FINAL: 'Quartas de final',
  SEMI_FINAL: 'Semifinal',
  THIRD_PLACE: 'Disputa de 3º lugar',
  FINAL: 'Final',
};

const GENDER_LABELS: Record<Gender, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
};

export function roundLabel(round: MatchRound): string {
  return ROUND_LABELS[round];
}

export function genderLabel(gender: Gender): string {
  return GENDER_LABELS[gender];
}

export function stageLabel(match: Pick<Match, 'stage' | 'round'>, groupName?: string): string {
  if (match.round) {
    return roundLabel(match.round);
  }
  return groupName ? `Grupo ${groupName}` : 'Fase de grupos';
}

const HYPHENATED_AGE_PREFIX = /\bsub-(?=\d)/gi;

export function displayCategoryName(name: string): string {
  return name.replace(HYPHENATED_AGE_PREFIX, (prefix) => `${prefix.slice(0, -1)} `);
}

export function categoryLabel(category: { name: string; gender: Gender }): string {
  const gender = genderLabel(category.gender);
  const name = displayCategoryName(category.name);
  return name.toLowerCase().includes(gender.toLowerCase()) ? name : `${name} ${gender}`;
}
