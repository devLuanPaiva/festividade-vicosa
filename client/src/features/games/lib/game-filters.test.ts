import { describe, expect, it } from 'vitest';
import { buildGamesHref, parseGameFilterParams, subEventsOfModality } from './game-filters';

const CATEGORY_ID = '0d8f3c52-6c1d-4f43-9d3b-1a2b3c4d5e6f';

describe('parseGameFilterParams', () => {
  it('defaults to the upcoming games of every modality', () => {
    expect(parseGameFilterParams({})).toEqual({
      modality: undefined,
      categoryId: undefined,
      scope: 'proximos',
    });
  });

  it('reads the modality, category and scope from the url', () => {
    expect(
      parseGameFilterParams({ modalidade: 'futsal', categoria: CATEGORY_ID, jogos: 'finalizados' }),
    ).toEqual({ modality: 'futsal', categoryId: CATEGORY_ID, scope: 'finalizados' });
  });

  it('ignores values it does not know instead of querying the api with them', () => {
    expect(
      parseGameFilterParams({ modalidade: 'xadrez', categoria: 'x', jogos: ['todos'] }),
    ).toEqual({ modality: undefined, categoryId: undefined, scope: 'proximos' });
  });

  it('drops the category when no modality is selected or it is not a uuid', () => {
    expect(parseGameFilterParams({ categoria: CATEGORY_ID }).categoryId).toBeUndefined();
    expect(
      parseGameFilterParams({ modalidade: 'handebol', categoria: 'abc' }).categoryId,
    ).toBeUndefined();
  });
});

describe('buildGamesHref', () => {
  it('writes only the filters that are set', () => {
    expect(buildGamesHref({ scope: 'proximos' })).toBe('/jogos?jogos=proximos');
    expect(
      buildGamesHref({ modality: 'handebol', categoryId: CATEGORY_ID, scope: 'finalizados' }),
    ).toBe(`/jogos?modalidade=handebol&categoria=${CATEGORY_ID}&jogos=finalizados`);
  });
});

describe('subEventsOfModality', () => {
  const subEvents = [
    { id: '1', type: 'JOCEV_FUTSAL' },
    { id: '2', type: 'JOCEV_HANDBALL' },
    { id: '3', type: 'ECOPEDAL' },
  ] as Parameters<typeof subEventsOfModality>[0];

  it('keeps only the sub-events that have games', () => {
    expect(subEventsOfModality(subEvents, undefined).map((item) => item.id)).toEqual(['1', '2']);
  });

  it('narrows to the selected modality', () => {
    expect(subEventsOfModality(subEvents, 'handebol').map((item) => item.id)).toEqual(['2']);
  });
});
