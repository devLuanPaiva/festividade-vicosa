export interface ImageSize {
  width: number;
  height: number;
}

export function fitWithin(size: ImageSize, longestSide: number): ImageSize {
  const scale = Math.min(1, longestSide / Math.max(size.width, size.height));
  return {
    width: Math.max(1, Math.round(size.width * scale)),
    height: Math.max(1, Math.round(size.height * scale)),
  };
}
