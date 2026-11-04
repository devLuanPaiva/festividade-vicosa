export function isCompleteOrder(orderedIds: string[], galleryPhotoIds: string[]): boolean {
  const unique = new Set(orderedIds);
  return (
    unique.size === orderedIds.length &&
    orderedIds.length === galleryPhotoIds.length &&
    galleryPhotoIds.every((id) => unique.has(id))
  );
}
