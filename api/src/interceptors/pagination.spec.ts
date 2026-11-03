import {
  buildPageUrl,
  buildPaginatedResponse,
  parsePageWindow,
  readCollection,
  type PageWindow,
} from './pagination';

const urlOf = (page: PageWindow): string =>
  `https://host/items?offset=${page.offset}&limit=${page.limit}`;
const numbers = (size: number): number[] => Array.from({ length: size }, (_, index) => index);

describe('parsePageWindow', () => {
  it.each([
    {
      scenario: 'uses the defaults when nothing is sent',
      query: {},
      expected: { offset: 0, limit: 100 },
    },
    {
      scenario: 'reads offset and limit',
      query: { offset: '20', limit: '10' },
      expected: { offset: 20, limit: 10 },
    },
    {
      scenario: 'ignores non numeric values',
      query: { offset: 'x', limit: 'y' },
      expected: { offset: 0, limit: 100 },
    },
    {
      scenario: 'ignores a zero limit',
      query: { limit: '0' },
      expected: { offset: 0, limit: 100 },
    },
  ])('$scenario', ({ query, expected }) => {
    expect(parsePageWindow(query)).toEqual(expected);
  });
});

describe('readCollection', () => {
  it('reads a plain array as a collection that still has to be sliced', () => {
    expect(readCollection([1, 2, 3])).toEqual({ items: [1, 2, 3], count: 3, isPreSliced: false });
  });

  it('reads an object with results and count as an already paginated collection', () => {
    expect(readCollection({ results: [1, 2], count: 10 })).toEqual({
      items: [1, 2],
      count: 10,
      isPreSliced: true,
    });
  });

  it('uses the number of results when the count is missing', () => {
    expect(readCollection({ results: [1, 2] })?.count).toBe(2);
  });

  it.each([null, undefined, 'text', 42, { id: 1 }])(
    'does not treat %p as a collection',
    (value) => {
      expect(readCollection(value)).toBeNull();
    },
  );
});

describe('buildPaginatedResponse', () => {
  it('slices the first page and links to the next one', () => {
    const collection = { items: numbers(25), count: 25, isPreSliced: false };

    expect(buildPaginatedResponse(collection, { offset: 0, limit: 10 }, urlOf)).toEqual({
      status: 'success',
      count: 25,
      currentPage: 1,
      totalPages: 3,
      next: 'https://host/items?offset=10&limit=10',
      previous: null,
      results: numbers(10),
    });
  });

  it('links to the previous page in the middle of the list', () => {
    const collection = { items: numbers(25), count: 25, isPreSliced: false };
    const response = buildPaginatedResponse(collection, { offset: 10, limit: 10 }, urlOf);

    expect(response.currentPage).toBe(2);
    expect(response.previous).toBe('https://host/items?offset=0&limit=10');
    expect(response.next).toBe('https://host/items?offset=20&limit=10');
  });

  it('has no next page on the last page', () => {
    const collection = { items: numbers(25), count: 25, isPreSliced: false };
    const response = buildPaginatedResponse(collection, { offset: 20, limit: 10 }, urlOf);

    expect(response.results).toHaveLength(5);
    expect(response.next).toBeNull();
  });

  it('does not slice a collection that the service already paginated', () => {
    const collection = { items: numbers(10), count: 25, isPreSliced: true };
    const response = buildPaginatedResponse(collection, { offset: 10, limit: 10 }, urlOf);

    expect(response.results).toEqual(numbers(10));
    expect(response.currentPage).toBe(2);
  });

  it('returns an empty first page for an empty collection', () => {
    const collection = { items: [], count: 0, isPreSliced: false };

    expect(buildPaginatedResponse(collection, { offset: 0, limit: 100 }, urlOf)).toMatchObject({
      count: 0,
      totalPages: 0,
      next: null,
      previous: null,
      results: [],
    });
  });
});

describe('buildPageUrl', () => {
  it('keeps the other text filters and replaces the page window', () => {
    expect(
      buildPageUrl('https://host/users', { search: 'ana', offset: '0' }, { offset: 10, limit: 5 }),
    ).toBe('https://host/users?search=ana&offset=10&limit=5');
  });

  it('drops query values that are not plain text', () => {
    expect(
      buildPageUrl('https://host/users', { tags: ['a', 'b'] }, { offset: 0, limit: 100 }),
    ).toBe('https://host/users?offset=0&limit=100');
  });
});
