import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListUsersQueryDto } from './list-users-query.dto';

async function parse(query: object): Promise<{ dto: ListUsersQueryDto; failingFields: string[] }> {
  const dto = plainToInstance(ListUsersQueryDto, query);
  const errors = await validate(dto);
  return { dto, failingFields: errors.map((error) => error.property) };
}

describe('ListUsersQueryDto', () => {
  it.each([
    { text: 'true', expected: true },
    { text: 'false', expected: false },
  ])('turns active=$text into the boolean $expected', async ({ text, expected }) => {
    const { dto, failingFields } = await parse({ active: text });

    expect(failingFields).toEqual([]);
    expect(dto.active).toBe(expected);
  });

  it('rejects an active flag that is not true or false', async () => {
    await expect(parse({ active: 'yes' })).resolves.toMatchObject({ failingFields: ['active'] });
  });
});
