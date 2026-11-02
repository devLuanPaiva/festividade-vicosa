import { DEFAULT_PAGE_SIZE } from '@/lib/pagination/page-size';
import { subEventMatchesPath } from './admin-gallery-paths';
import type { GalleryMatchQuery } from './gallery-match-view';

const PARAM_NAMES: Record<keyof GalleryMatchQuery, string> = {
  categoryId: 'categoria',
  day: 'dia',
  search: 'q',
  status: 'situacao',
  page: 'pagina',
  pageSize: 'itens',
};

const UNFILTERED: GalleryMatchQuery = {
  categoryId: '',
  day: '',
  search: '',
  status: 'todas',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export function buildGalleryMatchesHref(subEventId: string, query: GalleryMatchQuery): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(PARAM_NAMES) as (keyof GalleryMatchQuery)[]) {
    if (query[key] !== UNFILTERED[key]) {
      params.set(PARAM_NAMES[key], String(query[key]));
    }
  }
  const queryString = params.toString();
  const path = subEventMatchesPath(subEventId);
  return queryString ? `${path}?${queryString}` : path;
}
