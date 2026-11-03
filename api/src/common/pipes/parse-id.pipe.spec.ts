import { BadRequestException } from '@nestjs/common';
import { ParseIdPipe } from './parse-id.pipe';

const metadata = { type: 'param', data: 'id' } as const;
const VALID_ID = 'a3bb189e-8bf9-4888-9912-ace4e6543002';

const pipe = new ParseIdPipe();

describe('ParseIdPipe', () => {
  it('lets a uuid v4 through unchanged', async () => {
    await expect(pipe.transform(VALID_ID, metadata)).resolves.toBe(VALID_ID);
  });

  it.each([
    { scenario: 'free text', id: 'abc' },
    { scenario: 'a uuid of another version', id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
  ])('rejects $scenario pointing at the id field', async ({ id }) => {
    const failure = pipe.transform(id, metadata);

    await expect(failure).rejects.toBeInstanceOf(BadRequestException);
    await expect(failure).rejects.toMatchObject({
      response: { code: 'INVALID_ID', field: 'id' },
    });
  });
});
