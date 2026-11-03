import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

const RANDOM_KEY_BYTES = 12;

@Injectable()
export class RandomKeyGenerator {
  public next(): string {
    return randomBytes(RANDOM_KEY_BYTES).toString('hex');
  }
}
