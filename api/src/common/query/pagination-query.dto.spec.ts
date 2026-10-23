import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

async function failingFields(query: object): Promise<string[]> {
  const errors = await validate(plainToInstance(PaginationQueryDto, query));
  return errors.map((error) => error.property);
}

describe('PaginationQueryDto', () => {
  it('accepts no pagination at all', async () => {
    await expect(failingFields({})).resolves.toEqual([]);
  });

  it('accepts offset and limit sent as text', async () => {
    await expect(failingFields({ offset: '20', limit: '10' })).resolves.toEqual([]);
  });

  it.each([
    { query: { offset: '-1' }, field: 'offset' },
    { query: { offset: 'abc' }, field: 'offset' },
    { query: { limit: '0' }, field: 'limit' },
    { query: { limit: '1.5' }, field: 'limit' },
  ])('rejects $query', async ({ query, field }) => {
    await expect(failingFields(query)).resolves.toEqual([field]);
  });
});
