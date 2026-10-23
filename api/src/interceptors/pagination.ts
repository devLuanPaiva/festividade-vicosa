export interface PageWindow {
  offset: number;
  limit: number;
}

export interface Collection {
  items: unknown[];
  count: number;
  isPreSliced: boolean;
}

export interface PaginatedResponse {
  status: 'success';
  count: number;
  currentPage: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: unknown[];
}

const DEFAULT_LIMIT = 100;

function parsePositiveInteger(value: unknown, fallback: number, minimum: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isNaN(parsed) || parsed < minimum ? fallback : parsed;
}

export function parsePageWindow(query: Record<string, unknown>): PageWindow {
  return {
    offset: parsePositiveInteger(query.offset, 0, 0),
    limit: parsePositiveInteger(query.limit, DEFAULT_LIMIT, 1),
  };
}

export function readCollection(data: unknown): Collection | null {
  if (Array.isArray(data)) {
    return { items: data as unknown[], count: data.length, isPreSliced: false };
  }

  const { results, count } = (data ?? {}) as { results?: unknown; count?: unknown };
  if (!Array.isArray(results)) {
    return null;
  }

  const total = typeof count === 'number' ? count : results.length;
  return { items: results as unknown[], count: total, isPreSliced: true };
}

export function buildPageUrl(
  baseUrl: string,
  query: Record<string, unknown>,
  page: PageWindow,
): string {
  const textQuery = Object.entries(query).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );
  const params = new URLSearchParams({
    ...Object.fromEntries(textQuery),
    offset: String(page.offset),
    limit: String(page.limit),
  });
  return `${baseUrl}?${params.toString()}`;
}

function sliceResults(collection: Collection, window: PageWindow): unknown[] {
  return collection.isPreSliced
    ? collection.items
    : collection.items.slice(window.offset, window.offset + window.limit);
}

export function buildPaginatedResponse(
  collection: Collection,
  window: PageWindow,
  buildUrl: (page: PageWindow) => string,
): PaginatedResponse {
  const { offset, limit } = window;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(collection.count / limit);
  const results = sliceResults(collection, window);
  const hasNext = results.length === limit && currentPage < totalPages;

  return {
    status: 'success',
    count: collection.count,
    currentPage,
    totalPages,
    next: hasNext ? buildUrl({ offset: offset + limit, limit }) : null,
    previous: currentPage > 1 ? buildUrl({ offset: Math.max(0, offset - limit), limit }) : null,
    results,
  };
}
