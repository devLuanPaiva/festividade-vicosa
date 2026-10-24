import { createHash, randomBytes } from 'node:crypto';

const TOKEN_BYTES = 32;

export function generateTokenValue(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

export function hashTokenValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
