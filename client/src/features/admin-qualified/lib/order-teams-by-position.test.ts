import { describe, expect, it } from 'vitest';
import {
  BROKEN_SEQUENCE_MESSAGE,
  INVALID_POSITION_MESSAGE,
  orderTeamsByPosition,
  readPositions,
} from './order-teams-by-position';

describe('orderTeamsByPosition', () => {
  it('orders the teams by the confirmed position, whatever the order of the fields', () => {
    const result = orderTeamsByPosition({ b: '2', a: '1', c: '3' });

    expect(result).toEqual({ ok: true, teamIds: ['a', 'b', 'c'] });
  });

  it('leaves out the teams without a position, so only some of them qualify', () => {
    expect(orderTeamsByPosition({ a: '', b: '1', c: '' })).toEqual({ ok: true, teamIds: ['b'] });
  });

  it('clears the confirmation when no team has a position', () => {
    expect(orderTeamsByPosition({ a: '', b: '' })).toEqual({ ok: true, teamIds: [] });
  });

  it.each([
    ['a repeated position', { a: '1', b: '1' }],
    ['a skipped position', { a: '1', b: '3' }],
    ['a list that does not start at 1', { a: '2', b: '3' }],
  ])('refuses %s', (_name, positions) => {
    expect(orderTeamsByPosition(positions)).toEqual({
      ok: false,
      message: BROKEN_SEQUENCE_MESSAGE,
    });
  });

  it.each([
    ['zero', '0'],
    ['a negative number', '-1'],
    ['a decimal', '1.5'],
    ['text', 'primeiro'],
  ])('refuses %s as a position', (_name, value) => {
    expect(orderTeamsByPosition({ a: value })).toEqual({
      ok: false,
      message: INVALID_POSITION_MESSAGE,
    });
  });
});

describe('readPositions', () => {
  it('reads only the position fields, keyed by team and trimmed', () => {
    const formData = new FormData();
    formData.set('position-team-1', ' 2 ');
    formData.set('position-team-2', '');
    formData.set('other', 'x');

    expect(readPositions(formData)).toEqual({ 'team-1': '2', 'team-2': '' });
  });
});
