const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALPHANUMERIC_RUNS = /[^a-z0-9]+/g;
const SEPARATOR = '-';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_RUNS, SEPARATOR)
    .split(SEPARATOR)
    .filter(Boolean)
    .join(SEPARATOR);
}
