import { describe, expect, it } from 'vitest';
import type { BracketFormValues } from '../types';
import { toBracketPayload } from './bracket-payload';

const VALUES: BracketFormValues = {
  positions: {},
  date: '2026-12-12',
  time: '15:00',
  location: 'Ginásio Municipal',
};

describe('toBracketPayload', () => {
  it('sends the teams in the confirmed order and the first round as Fortaleza time', () => {
    expect(toBracketPayload(['a', 'b', 'c', 'd'], VALUES)).toEqual({
      teamIds: ['a', 'b', 'c', 'd'],
      scheduledAt: '2026-12-12T15:00:00-03:00',
      location: 'Ginásio Municipal',
    });
  });

  it('omits the location when it is blank', () => {
    expect(toBracketPayload(['a', 'b'], { ...VALUES, location: '' })).not.toHaveProperty(
      'location',
    );
  });
});
