export function subEventPhotosApiPath(subEventId: string): string {
  return `/sub-events/${encodeURIComponent(subEventId)}/photos`;
}
