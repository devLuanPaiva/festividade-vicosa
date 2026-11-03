export function movePhoto(photoIds: string[], index: number, offset: number): string[] {
  const target = index + offset;
  if (index < 0 || index >= photoIds.length || target < 0 || target >= photoIds.length) {
    return photoIds;
  }
  const reordered = [...photoIds];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(target, 0, moved ?? '');
  return reordered;
}
