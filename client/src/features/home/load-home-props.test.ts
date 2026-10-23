import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSubEventsOfEdition } from '@/features/schedule/schedule-service';
import { loadHomeProps } from './load-home-props';

vi.mock('@/features/schedule/schedule-service');

describe('loadHomeProps', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the sub-events of the 2026 edition revalidated every minute', async () => {
    vi.mocked(fetchSubEventsOfEdition).mockResolvedValue([]);

    const result = await loadHomeProps();

    expect(fetchSubEventsOfEdition).toHaveBeenCalledWith(2026);
    expect(result).toEqual({ props: { subEvents: [] }, revalidate: 60 });
  });

  it('renders an empty program and retries soon when the api is unreachable', async () => {
    vi.mocked(fetchSubEventsOfEdition).mockRejectedValue(new Error('offline'));

    const result = await loadHomeProps();

    expect(result).toEqual({ props: { subEvents: [] }, revalidate: 10 });
  });
});
