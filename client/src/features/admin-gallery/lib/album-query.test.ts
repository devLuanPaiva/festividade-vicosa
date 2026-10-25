import { describe, expect, it } from 'vitest';
import { albumTargetToQuery, parseAlbumTarget } from './album-query';
import type { AlbumTarget } from '../types';

const SUB_EVENT_ID = '9e52076c-fa22-498a-90fe-d1b2e55a71d5';
const MATCH_ID = '0d1b7c1e-3f55-4d8e-8a4a-7c6a2f9b1e10';

function parse(query: string): AlbumTarget | null {
  return parseAlbumTarget(new URLSearchParams(query));
}

describe('album query', () => {
  it.each<AlbumTarget>([
    { kind: 'event-day', subEventId: SUB_EVENT_ID, date: '2026-12-09' },
    { kind: 'match', matchId: MATCH_ID },
  ])('reads back the album it wrote (%o)', (target) => {
    expect(parse(albumTargetToQuery(target))).toEqual(target);
  });

  it.each([
    { name: 'an unknown kind', query: `kind=users&matchId=${MATCH_ID}` },
    { name: 'a match without a valid id', query: 'kind=match&matchId=../users' },
    {
      name: 'a day without a valid sub-event id',
      query: 'kind=event-day&subEventId=x&date=2026-12-09',
    },
    {
      name: 'a day without a valid date',
      query: `kind=event-day&subEventId=${SUB_EVENT_ID}&date=today`,
    },
    { name: 'no parameters at all', query: '' },
  ])('refuses $name', ({ query }) => {
    expect(parse(query)).toBeNull();
  });
});
