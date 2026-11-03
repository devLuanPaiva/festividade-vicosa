import { describe, expect, it } from 'vitest';
import type { MatchDetail } from '../services/get-match-detail';
import { buildMatchShare } from './match-share';

function detail(match: Partial<MatchDetail['match']>): MatchDetail {
  return {
    match: {
      id: 'm',
      stage: 'KNOCKOUT',
      round: 'FINAL',
      status: 'FINALIZED',
      resultType: 'PLAYED',
      scheduledAt: '2026-12-19T22:00:00.000Z',
      location: 'Ginásio Municipal',
      scoreA: 2,
      scoreB: 1,
      penaltiesA: null,
      penaltiesB: null,
      winnerId: 'a',
      ...match,
    } as MatchDetail['match'],
    teamA: { id: 'a', name: 'Centro' } as MatchDetail['teamA'],
    teamB: { id: 'b', name: 'Bairro Novo' } as MatchDetail['teamB'],
    category: { name: 'Adulto', gender: 'MALE' } as MatchDetail['category'],
    groupName: null,
  };
}

describe('buildMatchShare', () => {
  it('shows the score in the title of a finished match', () => {
    expect(buildMatchShare(detail({}))).toEqual({
      title: 'Centro 2 x 1 Bairro Novo',
      description: 'Final · Adulto Masculino',
    });
  });

  it('adds the penalties to the description of a shootout', () => {
    const share = buildMatchShare(detail({ scoreA: 2, scoreB: 2, penaltiesA: 4, penaltiesB: 3 }));

    expect(share.title).toBe('Centro 2 x 2 Bairro Novo');
    expect(share.description).toContain('4-3 nos pênaltis');
  });

  it('announces day, time and place, without a score, before the match', () => {
    const share = buildMatchShare(
      detail({ status: 'SCHEDULED', scoreA: null, scoreB: null, winnerId: null }),
    );

    expect(share.title).toBe('Centro x Bairro Novo');
    expect(share.description).toContain('19:00');
    expect(share.description).toContain('Ginásio Municipal');
  });

  it('flags a walkover in the description', () => {
    const share = buildMatchShare(detail({ resultType: 'WALKOVER' }));

    expect(share.description).toContain('Vitória por W.O.');
  });
});
