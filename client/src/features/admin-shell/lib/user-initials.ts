const MAX_INITIALS = 2;
const UNKNOWN_INITIALS = '?';

export function toInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
  return initials || UNKNOWN_INITIALS;
}
