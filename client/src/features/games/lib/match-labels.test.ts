import { describe, expect, it } from 'vitest';
import { categoryLabel, stageLabel } from './match-labels';

describe('categoryLabel', () => {
  it('adds the gender when the category name does not carry it', () => {
    expect(categoryLabel({ name: 'Adulto', gender: 'MALE' })).toBe('Adulto Masculino');
  });

  it('does not repeat the gender when the name already carries it', () => {
    expect(categoryLabel({ name: 'Sub-18 Feminino', gender: 'FEMALE' })).toBe('Sub-18 Feminino');
  });
});

describe('stageLabel', () => {
  it('names the knockout round', () => {
    expect(stageLabel({ stage: 'KNOCKOUT', round: 'SEMI_FINAL' })).toBe('Semifinal');
  });

  it('names the group when it is known and falls back to the group stage', () => {
    expect(stageLabel({ stage: 'GROUP', round: null }, 'A')).toBe('Grupo A');
    expect(stageLabel({ stage: 'GROUP', round: null })).toBe('Fase de grupos');
  });
});
