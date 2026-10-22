import { NodeEnvironment, validateEnvironment } from './environment';

const validConfig = {
  DATABASE_HOST: 'localhost',
  DATABASE_USER: 'festival',
  DATABASE_PASSWORD: 'secret',
  DATABASE_NAME: 'festival',
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
});
