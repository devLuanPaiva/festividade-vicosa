export function pairKey(first: string, second: string): string {
  return [first, second].sort((a, b) => a.localeCompare(b)).join('|');
}
