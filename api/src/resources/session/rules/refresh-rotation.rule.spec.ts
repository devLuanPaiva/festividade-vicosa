import { judgeRefreshToken, type RefreshVerdict } from './refresh-rotation.rule';

const NOW = new Date('2026-12-10T12:00:00Z');
const FUTURE = new Date('2026-12-17T12:00:00Z');

function secondsBeforeNow(seconds: number): Date {
  return new Date(NOW.getTime() - seconds * 1000);
}

interface Case {
  name: string;
  expiresAt: Date;
  rotatedAt: Date | null;
  expected: RefreshVerdict;
}

const CASES: Case[] = [
  { name: 'a valid token never used', expiresAt: FUTURE, rotatedAt: null, expected: 'ROTATE' },
  {
    name: 'an expired token',
    expiresAt: secondsBeforeNow(1),
    rotatedAt: null,
    expected: 'EXPIRED',
  },
  { name: 'a token that expires now', expiresAt: NOW, rotatedAt: null, expected: 'EXPIRED' },
  {
    name: 'a token rotated seconds ago, as parallel requests do',
    expiresAt: FUTURE,
    rotatedAt: secondsBeforeNow(5),
    expected: 'ROTATE',
  },
  {
    name: 'a token rotated long ago, which means it was replayed',
    expiresAt: FUTURE,
    rotatedAt: secondsBeforeNow(60),
    expected: 'REUSED',
  },
  {
    name: 'an expired token that was also rotated',
    expiresAt: secondsBeforeNow(1),
    rotatedAt: secondsBeforeNow(60),
    expected: 'EXPIRED',
  },
];

describe('judgeRefreshToken', () => {
  it.each(CASES)('judges $name', ({ expiresAt, rotatedAt, expected }) => {
    expect(judgeRefreshToken({ expiresAt, rotatedAt }, NOW)).toBe(expected);
  });
});
