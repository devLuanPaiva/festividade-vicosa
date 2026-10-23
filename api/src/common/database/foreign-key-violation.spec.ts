import { QueryFailedError } from 'typeorm';
import { isForeignKeyViolation, runUnlessReferenced } from './foreign-key-violation';

function queryFailure(code: string | undefined): QueryFailedError {
  return new QueryFailedError('DELETE', [], Object.assign(new Error('failed'), { code }));
}

describe('isForeignKeyViolation', () => {
  it('recognizes the Postgres foreign key violation', () => {
    expect(isForeignKeyViolation(queryFailure('23503'))).toBe(true);
  });

  it.each([
    { scenario: 'another database error', error: queryFailure('23505') },
    { scenario: 'a plain error', error: new Error('23503') },
  ])('ignores $scenario', ({ error }) => {
    expect(isForeignKeyViolation(error)).toBe(false);
  });
});

describe('runUnlessReferenced', () => {
  it('runs the operation and returns when it succeeds', async () => {
    const operation = jest.fn().mockResolvedValue(undefined);

    await expect(
      runUnlessReferenced(operation, () => new Error('referenced')),
    ).resolves.toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('throws the referenced error on a foreign key violation', async () => {
    const operation = jest.fn().mockRejectedValue(queryFailure('23503'));

    await expect(runUnlessReferenced(operation, () => new Error('referenced'))).rejects.toThrow(
      'referenced',
    );
  });

  it('rethrows any other failure untouched', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('connection lost'));

    await expect(runUnlessReferenced(operation, () => new Error('referenced'))).rejects.toThrow(
      'connection lost',
    );
  });
});
