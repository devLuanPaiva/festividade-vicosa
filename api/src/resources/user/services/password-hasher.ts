import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const SALT_BYTES = 16;
const KEY_BYTES = 64;
const SEPARATOR = ':';

const deriveKey = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keyLength: number,
) => Promise<Buffer>;

@Injectable()
export class PasswordHasher {
  public async hash(password: string): Promise<string> {
    const salt = randomBytes(SALT_BYTES);
    const key = await deriveKey(password, salt, KEY_BYTES);
    return [salt, key].map((part) => part.toString('hex')).join(SEPARATOR);
  }

  public async verify(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, keyHex] = storedHash.split(SEPARATOR);
    if (!saltHex || !keyHex) {
      return false;
    }

    const expectedKey = Buffer.from(keyHex, 'hex');
    const actualKey = await deriveKey(password, Buffer.from(saltHex, 'hex'), expectedKey.length);
    return timingSafeEqual(actualKey, expectedKey);
  }
}
