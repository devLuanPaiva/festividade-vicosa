import { BadRequestException } from '@nestjs/common';
import { ParseIdPipe } from './parse-id.pipe';

const metadata = { type: 'param', data: 'id' } as const;

const pipe = new ParseIdPipe();

describe('ParseIdPipe', () => {
  it('converts a numeric string into a number', async () => {
    await expect(pipe.transform('42', metadata)).resolves.toBe(42);
  });

  it('rejects a non numeric id pointing at the id field', async () => {
    const failure = pipe.transform('abc', metadata);

    await expect(failure).rejects.toBeInstanceOf(BadRequestException);
    await expect(failure).rejects.toMatchObject({
      response: { code: 'INVALID_ID', field: 'id' },
    });
  });
});
