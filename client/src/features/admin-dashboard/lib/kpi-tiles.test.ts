import { describe, expect, it } from 'vitest';
import type { Overview } from '../types';
import { buildKpiTiles } from './kpi-tiles';

const OVERVIEW: Overview = {
  categories: 11,
  teams: 88,
  matches: {
    total: 142,
    scheduled: 49,
    finalized: 93,
    today: 0,
    overdue: 0,
    walkovers: 1,
    completionRate: 65,
  },
  goals: { total: 3010, perMatch: 32.72 },
};

function tileOf(overview: Overview, key: string): ReturnType<typeof buildKpiTiles>[number] {
  const tile = buildKpiTiles(overview).find((candidate) => candidate.key === key);
  if (!tile) {
    throw new Error(`missing tile ${key}`);
  }
  return tile;
}

describe('buildKpiTiles', () => {
  it('keeps the strip at five tiles, the most the dashboard pattern allows', () => {
    expect(buildKpiTiles(OVERVIEW)).toHaveLength(5);
  });

  it('writes numbers the Brazilian way', () => {
    const goals = tileOf(OVERVIEW, 'goals');

    expect(goals.value).toBe('3.010');
    expect(goals.caption).toBe('32,7 por partida jogada');
  });

  it('shows the progress of the championship as a meter', () => {
    const finalized = tileOf(OVERVIEW, 'finalized');

    expect(finalized.value).toBe('93');
    expect(finalized.caption).toBe('de 142 partidas (65%)');
    expect(finalized.meterPercent).toBe(65);
  });

  it('only calls for attention when there are matches past their time without a result', () => {
    expect(tileOf(OVERVIEW, 'overdue')).toMatchObject({
      caption: 'Tudo em dia',
      needsAttention: false,
    });

    const late = { ...OVERVIEW, matches: { ...OVERVIEW.matches, overdue: 3 } };
    expect(tileOf(late, 'overdue')).toMatchObject({
      value: '3',
      caption: 'Já passaram do horário',
      needsAttention: true,
    });
  });

  it('says plainly when there is no game today', () => {
    expect(tileOf(OVERVIEW, 'today').caption).toBe('Nenhum jogo marcado para hoje');
  });
});
