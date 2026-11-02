export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;

export function parsePageSize(value: string): number {
  const size = Number.parseInt(value, 10);
  return PAGE_SIZE_OPTIONS.includes(size) ? size : DEFAULT_PAGE_SIZE;
}

export function parsePageNumber(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
