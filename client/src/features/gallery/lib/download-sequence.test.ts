import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadSequentially } from './download-sequence';

describe('downloadSequentially', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts one download per link, one after the other, in the order given', async () => {
    const started: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      started.push(this.getAttribute('href') ?? '');
    });

    await downloadSequentially(['/galeria/download?key=a', '/galeria/download?key=b'], 1);

    expect(started).toEqual(['/galeria/download?key=a', '/galeria/download?key=b']);
  });

  it('leaves no link behind in the page', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    await downloadSequentially(['/galeria/download?key=a'], 1);

    expect(document.querySelectorAll('a[download]')).toHaveLength(0);
  });

  it('does nothing for an empty selection', async () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    await downloadSequentially([], 1);

    expect(click).not.toHaveBeenCalled();
  });
});
