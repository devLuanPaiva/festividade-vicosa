import { describe, expect, it } from 'vitest';
import { EMPTY_MATCH_VALUES, type MatchFormValues } from '../types';
import { toCreateMatchPayload, toUpdateMatchPayload } from './parse-match-form';

const GROUP_MATCH: MatchFormValues = {
  ...EMPTY_MATCH_VALUES,
  groupId: 'group-a',
  round: 'FINAL',
  teamAId: 'team-1',
  teamBId: 'team-2',
  date: '2026-12-18',
  time: '20:00',
  location: 'Ginásio',
};

describe('toCreateMatchPayload', () => {
  it('sends only the group on a group-stage match, even if a round was left in the form', () => {
    const payload = toCreateMatchPayload(GROUP_MATCH);

    expect(payload).toEqual({
      stage: 'GROUP',
      groupId: 'group-a',
      scheduledAt: '2026-12-18T20:00:00-03:00',
      teamAId: 'team-1',
      teamBId: 'team-2',
      location: 'Ginásio',
    });
  });

  it('sends only the round on a knockout match, even if a group was left in the form', () => {
    const payload = toCreateMatchPayload({ ...GROUP_MATCH, stage: 'KNOCKOUT' });

    expect(payload.round).toBe('FINAL');
    expect(payload).not.toHaveProperty('groupId');
  });

  it('omits the location when it is blank', () => {
    expect(toCreateMatchPayload({ ...GROUP_MATCH, location: '' })).not.toHaveProperty('location');
  });
});

describe('toUpdateMatchPayload', () => {
  it('keeps the teams out of the change when the match is already finalized', () => {
    const payload = toUpdateMatchPayload(GROUP_MATCH, false);

    expect(payload).toEqual({ scheduledAt: '2026-12-18T20:00:00-03:00', location: 'Ginásio' });
  });

  it('sends a blank location so the API clears it', () => {
    expect(toUpdateMatchPayload({ ...GROUP_MATCH, location: '' }, true).location).toBe('');
  });

  it('sends the teams while the match is still scheduled', () => {
    const payload = toUpdateMatchPayload(GROUP_MATCH, true);

    expect(payload.teamAId).toBe('team-1');
    expect(payload.teamBId).toBe('team-2');
  });
});
