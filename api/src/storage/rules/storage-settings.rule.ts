export interface StorageSettings {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string | null;
  publicUrl: string;
}

export interface StorageEnvironment {
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  S3_BUCKET: string;
  S3_ENDPOINT?: string;
  MEDIA_PUBLIC_URL: string;
}

function filled(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed === '' ? null : trimmed;
}

function withoutTrailingSlashes(address: string): string {
  let end = address.length;
  while (end > 0 && address[end - 1] === '/') {
    end -= 1;
  }
  return address.slice(0, end);
}

export function readStorageSettings(environment: StorageEnvironment): StorageSettings | null {
  const region = filled(environment.AWS_REGION);
  const accessKeyId = filled(environment.AWS_ACCESS_KEY_ID);
  const secretAccessKey = filled(environment.AWS_SECRET_ACCESS_KEY);
  const bucket = filled(environment.S3_BUCKET);
  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }
  return {
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint: filled(environment.S3_ENDPOINT),
    publicUrl: withoutTrailingSlashes(environment.MEDIA_PUBLIC_URL.trim()),
  };
}
