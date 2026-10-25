import { describe, expect, it } from 'vitest';
import { runWithConcurrency } from './run-with-concurrency';

function pause(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 5));
}

describe('runWithConcurrency', () => {
  it('handles every item exactly once', async () => {
    const seen: number[] = [];

    await runWithConcurrency([1, 2, 3, 4, 5], 2, async (item) => {
      await pause();
      seen.push(item);
    });

    expect(seen.toSorted()).toEqual([1, 2, 3, 4, 5]);
  });

  it('never runs more items at once than the limit', async () => {
    let running = 0;
    let highest = 0;

    await runWithConcurrency([1, 2, 3, 4, 5, 6], 2, async () => {
      running += 1;
      highest = Math.max(highest, running);
      await pause();
      running -= 1;
    });

    expect(highest).toBe(2);
  });

  it('starts the items in the order they were given', async () => {
    const started: number[] = [];

    await runWithConcurrency([1, 2, 3], 1, async (item) => {
      started.push(item);
      await pause();
    });

    expect(started).toEqual([1, 2, 3]);
  });

  it('does nothing for an empty list', async () => {
    await expect(runWithConcurrency([], 3, () => Promise.resolve())).resolves.toBeUndefined();
  });
});
