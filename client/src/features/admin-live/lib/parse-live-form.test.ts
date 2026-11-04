import { describe, expect, it } from 'vitest';
import { parseLiveForm, toLivePayload } from './parse-live-form';

describe('toLivePayload', () => {
  it('sends the start as a Fortaleza date and time the API can read', () => {
    const payload = toLivePayload({
      title: 'Final do futsal',
      url: 'https://youtu.be/dQw4w9WgXcQ',
      date: '2026-12-19',
      time: '19:30',
    });

    expect(payload).toEqual({
      title: 'Final do futsal',
      url: 'https://youtu.be/dQw4w9WgXcQ',
      startsAt: '2026-12-19T19:30:00-03:00',
    });
  });

  it('sends an empty start when the date or the time was left blank, so the API names the field', () => {
    expect(toLivePayload({ title: 'a', url: 'b', date: '2026-12-19', time: '' }).startsAt).toBe('');
  });
});

describe('parseLiveForm', () => {
  it('trims what the person typed', () => {
    const formData = new FormData();
    formData.set('title', '  Final  ');
    formData.set('url', ' https://youtu.be/dQw4w9WgXcQ ');

    expect(parseLiveForm(formData)).toMatchObject({
      title: 'Final',
      url: 'https://youtu.be/dQw4w9WgXcQ',
    });
  });
});
