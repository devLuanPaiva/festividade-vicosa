const THUMBNAIL_QUALITY = 0.7;
const THUMBNAIL_TYPE = 'image/jpeg';

export async function createThumbnail(file: File, width: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
    resizeWidth: width,
    resizeQuality: 'medium',
  });
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('thumbnail failed'))),
        THUMBNAIL_TYPE,
        THUMBNAIL_QUALITY,
      );
    });
  } finally {
    bitmap.close();
  }
}
