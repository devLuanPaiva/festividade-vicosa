import { describe, expect, it } from 'vitest';
import { categoryLabel, displayCategoryName, stageLabel } from './match-labels';

describe('categoryLabel', () => {
  it('adds the gender when the category name does not carry it', () => {
    expect(categoryLabel({ name: 'Adulto', gender: 'MALE' })).toBe('Adulto Masculino');
  });

  it('does not repeat the gender when the name already carries it', () => {
    expect(categoryLabel({ name: 'Sub-18 Feminino', gender: 'FEMALE' })).toBe('Sub 18 Feminino');
  });

  it('shows the age prefix without the hyphen', () => {
    expect(categoryLabel({ name: 'Sub-15', gender: 'MALE' })).toBe('Sub 15 Masculino');
  });
});

describe('displayCategoryName', () => {
  it.each([
    ['Sub-13', 'Sub 13'],
    ['sub-18 Feminino', 'sub 18 Feminino'],
    ['Adulto', 'Adulto'],
    ['12-14 Feminino', '12-14 Feminino'],
  ])('turns %s into %s', (name, expected) => {
    expect(displayCategoryName(name)).toBe(expected);
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
