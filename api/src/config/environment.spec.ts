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
    expect(environment.JWT_EXPIRES_IN).toBe('12h');
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

  it.each(Object.keys(validConfig))('rejects a configuration without %s', (variable) => {
    expect(() => validateEnvironment(withoutVariable(variable))).toThrow(variable);
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

  it('accepts the initial administrator credentials', () => {
    const environment = validateEnvironment({
      ...validConfig,
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_INITIAL_PASSWORD: 'a-long-password',
    });

    expect(environment.ADMIN_EMAIL).toBe('admin@example.com');
  });

  it.each([
    { variable: 'ADMIN_EMAIL', value: 'not-an-email' },
    { variable: 'ADMIN_INITIAL_PASSWORD', value: 'short' },
  ])('rejects an invalid $variable', ({ variable, value }) => {
    expect(() => validateEnvironment({ ...validConfig, [variable]: value })).toThrow(variable);
  });
});
