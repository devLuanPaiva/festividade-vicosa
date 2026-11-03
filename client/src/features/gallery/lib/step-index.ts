export function stepIndex(index: number, offset: number, length: number): number {
  if (length === 0) {
    return 0;
  }
  return (((index + offset) % length) + length) % length;
}
