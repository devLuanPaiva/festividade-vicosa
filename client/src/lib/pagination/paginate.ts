export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

export function lastPageOf(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function offsetOf(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

interface PageInput<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function buildPage<T>({ items, total, page, pageSize }: PageInput<T>): Page<T> {
  const totalPages = lastPageOf(total, pageSize);
  return { items, page: Math.min(Math.max(1, page), totalPages), totalPages, total };
}
