import { NodeEnvironment, validateEnvironment } from './environment';

const validConfig = {
  DATABASE_HOST: 'localhost',
  DATABASE_USER: 'festival',
  DATABASE_PASSWORD: 'secret',
  DATABASE_NAME: 'festival',
  JWT_SECRET: 'a-secret-with-at-least-32-characters',
};

function withoutVariable(variable: string): Record<string, string> {
  return Object.fromEntries(Object.entries(validConfig).filter(([key]) => key !== variable));
}

describe('validateEnvironment', () => {
  it('applies defaults for optional variables', () => {
    const environment = validateEnvironment(validConfig);

    expect(environment.NODE_ENV).toBe(NodeEnvironment.DEVELOPMENT);
    expect(environment.PORT).toBe(3000);
    expect(environment.DATABASE_PORT).toBe(5432);
    expect(environment.JWT_EXPIRES_IN).toBe('15m');
    expect(environment.REFRESH_TOKEN_EXPIRES_IN_DAYS).toBe(7);
  });

  it('converts numeric strings to numbers', () => {
    const environment = validateEnvironment({
      ...validConfig,
      PORT: '8080',
      DATABASE_PORT: '6543',
    });

    expect(environment.PORT).toBe(8080);
    expect(environment.DATABASE_PORT).toBe(6543);
  });

  it.each(['DATABASE_HOST', 'JWT_SECRET'])('rejects a configuration without %s', (variable) => {
    expect(() => validateEnvironment(withoutVariable(variable))).toThrow(variable);
  });

  it.each(['0', '91', 'abc'])('rejects %s as the refresh token lifetime in days', (days) => {
    expect(() =>
      validateEnvironment({ ...validConfig, REFRESH_TOKEN_EXPIRES_IN_DAYS: days }),
    ).toThrow('REFRESH_TOKEN_EXPIRES_IN_DAYS');
  });

  it('rejects a port outside the valid range', () => {
    expect(() => validateEnvironment({ ...validConfig, PORT: '70000' })).toThrow('PORT');
  });

  it('rejects an unknown node environment', () => {
    expect(() => validateEnvironment({ ...validConfig, NODE_ENV: 'staging' })).toThrow('NODE_ENV');
  });

  it('rejects a jwt secret shorter than 32 characters', () => {
    expect(() => validateEnvironment({ ...validConfig, JWT_SECRET: 'too-short' })).toThrow(
      'JWT_SECRET',
    );
  });
});
