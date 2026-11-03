export interface PageItem {
  page: number;
  isOuter: boolean;
}

const VISIBLE_PAGES = 5;
const SIDE_PAGES = Math.floor(VISIBLE_PAGES / 2);
const NEAR_PAGES = 1;

export function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  const visible = Math.min(VISIBLE_PAGES, totalPages);
  const firstPage = Math.min(Math.max(1, currentPage - SIDE_PAGES), totalPages - visible + 1);
  return Array.from({ length: visible }, (_, index) => {
    const page = firstPage + index;
    return { page, isOuter: Math.abs(page - currentPage) > NEAR_PAGES };
  });
}
