import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RoleCode } from '../../role/enums/role-code.enum';
import { ListUsersQueryDto } from './list-users-query.dto';

async function parse(query: object): Promise<{ dto: ListUsersQueryDto; failingFields: string[] }> {
  const dto = plainToInstance(ListUsersQueryDto, query);
  const errors = await validate(dto);
  return { dto, failingFields: errors.map((error) => error.property) };
}

describe('ListUsersQueryDto', () => {
  it('accepts an empty query', async () => {
    await expect(parse({})).resolves.toMatchObject({ failingFields: [] });
  });

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

  it('accepts a known role code and a search text', async () => {
    const { failingFields } = await parse({ roleCode: RoleCode.MANAGER, search: 'ana' });

    expect(failingFields).toEqual([]);
  });

  it('rejects an unknown role code', async () => {
    await expect(parse({ roleCode: 'OWNER' })).resolves.toMatchObject({
      failingFields: ['roleCode'],
    });
  });

  it('rejects a search text above the limit', async () => {
    await expect(parse({ search: 'a'.repeat(121) })).resolves.toMatchObject({
      failingFields: ['search'],
    });
  });
});
