export function photoCountLabel(count: number): string {
  if (count === 0) {
    return 'Sem fotos';
  }
  return count === 1 ? '1 foto' : `${count} fotos`;
}
