import { UnauthorizedException } from '@nestjs/common';
import { extractBearerToken } from './bearer-token';

describe('extractBearerToken', () => {
  it('returns the token of a bearer authorization header', () => {
    expect(extractBearerToken({ headers: { authorization: 'Bearer abc.def.ghi' } })).toBe(
      'abc.def.ghi',
    );
  });

  it.each([
    { scenario: 'the header is missing', headers: {} },
    { scenario: 'the scheme is not bearer', headers: { authorization: 'Basic abc' } },
    { scenario: 'the header has no token prefix', headers: { authorization: 'abc.def' } },
  ])('rejects the request when $scenario', ({ headers }) => {
    expect(() => extractBearerToken({ headers })).toThrow(UnauthorizedException);
  });
});
