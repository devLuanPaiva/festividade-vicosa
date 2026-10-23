import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchApiPage } from '@/lib/api/server-fetch';
import { fetchSubEventsOfEdition } from './schedule-service';

vi.mock('@/lib/api/server-fetch');

describe('fetchSubEventsOfEdition', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the sub-events of the edition found for the year', async () => {
    vi.mocked(fetchApiPage)
      .mockResolvedValueOnce([{ id: 'edition-1', year: 2026 }])
      .mockResolvedValueOnce([{ id: 'sub-event-1' }]);

    const subEvents = await fetchSubEventsOfEdition(2026);

    expect(fetchApiPage).toHaveBeenNthCalledWith(1, '/editions?year=2026&limit=1');
    expect(fetchApiPage).toHaveBeenNthCalledWith(2, '/editions/edition-1/sub-events');
    expect(subEvents).toEqual([{ id: 'sub-event-1' }]);
  });

  it('returns no sub-events when the year has no edition', async () => {
    vi.mocked(fetchApiPage).mockResolvedValueOnce([]);

    await expect(fetchSubEventsOfEdition(1999)).resolves.toEqual([]);
    expect(fetchApiPage).toHaveBeenCalledTimes(1);
  });
});
