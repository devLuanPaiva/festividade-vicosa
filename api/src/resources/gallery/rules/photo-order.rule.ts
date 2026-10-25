export function isCompleteOrder(orderedIds: string[], albumPhotoIds: string[]): boolean {
  const unique = new Set(orderedIds);
  return (
    unique.size === orderedIds.length &&
    orderedIds.length === albumPhotoIds.length &&
    albumPhotoIds.every((id) => unique.has(id))
  );
}
