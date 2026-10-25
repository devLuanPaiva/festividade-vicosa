const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SOURCE_BYTES = 40 * 1024 * 1024;
export const MAX_STAGED_PHOTOS = 40;

export interface SelectionResult {
  accepted: File[];
  notices: string[];
}

function refusalFor(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.name}: envie JPG, PNG ou WebP.`;
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return `${file.name}: a foto é grande demais (limite de 40 MB).`;
  }
  return null;
}

export function selectPhotos(files: File[], alreadyStaged: number): SelectionResult {
  const room = Math.max(0, MAX_STAGED_PHOTOS - alreadyStaged);
  const accepted: File[] = [];
  const notices: string[] = [];
  for (const file of files) {
    const refusal = refusalFor(file);
    if (refusal) {
      notices.push(refusal);
    } else if (accepted.length < room) {
      accepted.push(file);
    } else {
      notices.push(`${file.name}: limite de ${MAX_STAGED_PHOTOS} fotos por envio.`);
    }
  }
  return { accepted, notices };
}

const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * KILOBYTE;

export function formatFileSize(bytes: number): string {
  if (bytes >= MEGABYTE) {
    return `${(bytes / MEGABYTE).toFixed(1).replace('.', ',')} MB`;
  }
  return `${Math.max(1, Math.round(bytes / KILOBYTE))} KB`;
}
