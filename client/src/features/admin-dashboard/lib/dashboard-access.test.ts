import { describe, expect, it } from 'vitest';
import { canViewChampionshipDashboard } from './dashboard-access';

describe('canViewChampionshipDashboard', () => {
  it.each([
    { name: 'a photographer', permissions: ['photo:upload', 'photo:delete'], expected: false },
    { name: 'a user without permissions', permissions: [], expected: false },
    {
      name: 'who records scores',
      permissions: ['match:record-score', 'photo:upload'],
      expected: true,
    },
    { name: 'who manages teams', permissions: ['team:manage'], expected: true },
  ])('answers $expected for $name', ({ permissions, expected }) => {
    expect(canViewChampionshipDashboard(permissions)).toBe(expected);
  });
});
