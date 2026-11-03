import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getEditionSubEvents } from '@/features/schedule/services/get-edition-sub-events';
import type { MatchListItem } from '../types';
import { getGameMatches } from './get-game-matches';
import { getMatches } from './get-matches';

vi.mock('@/features/schedule/services/get-edition-sub-events');
vi.mock('./get-matches');

function matchAt(id: string, scheduledAt: string): MatchListItem {
  return { id, scheduledAt } as MatchListItem;
}

describe('getGameMatches', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getEditionSubEvents).mockResolvedValue([
      { id: 'futsal-id', type: 'JOCEV_FUTSAL' },
      { id: 'handball-id', type: 'JOCEV_HANDBALL' },
      { id: 'party-id', type: 'EMANCIPATION_PARTY' },
    ] as Awaited<ReturnType<typeof getEditionSubEvents>>);
    vi.mocked(getMatches).mockImplementation(({ subEventId }) =>
      Promise.resolve(
        subEventId === 'futsal-id'
          ? [matchAt('futsal-late', '2026-12-10T12:00:00Z')]
          : [matchAt('handball-early', '2026-12-05T12:00:00Z')],
      ),
    );
  });

  it('merges the games of every modality by date, asking the api only for sub-events with games', async () => {
    const matches = await getGameMatches({ scope: 'proximos' });

    expect(matches.map((match) => match.id)).toEqual(['handball-early', 'futsal-late']);
    expect(getMatches).toHaveBeenCalledTimes(2);
    expect(getMatches).toHaveBeenCalledWith({
      subEventId: 'futsal-id',
      categoryId: undefined,
      status: 'SCHEDULED',
    });
  });

  it('lists the finalized games from the most recent to the oldest', async () => {
    const matches = await getGameMatches({ scope: 'finalizados' });

    expect(matches.map((match) => match.id)).toEqual(['futsal-late', 'handball-early']);
    expect(getMatches).toHaveBeenCalledWith(expect.objectContaining({ status: 'FINALIZED' }));
  });

  it('asks only for the selected modality and category', async () => {
    await getGameMatches({ scope: 'proximos', modality: 'futsal', categoryId: 'category-1' });

    expect(getMatches).toHaveBeenCalledTimes(1);
    expect(getMatches).toHaveBeenCalledWith({
      subEventId: 'futsal-id',
      categoryId: 'category-1',
      status: 'SCHEDULED',
    });
  });
});
