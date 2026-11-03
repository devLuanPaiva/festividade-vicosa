import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  BoundedInteger,
  OptionalDescription,
  OptionalLocation,
  RequiredName,
} from './field-decorators';

class Sample {
  @RequiredName()
  public name?: unknown;

  @OptionalDescription()
  public description?: unknown;
}

async function messagesFor(
  values: Partial<Record<'name' | 'description', unknown>>,
): Promise<string[]> {
  const sample = Object.assign(new Sample(), values);
  const errors = await validate(sample);
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

describe('RequiredName', () => {
  it.each([
    { scenario: 'a missing name', name: undefined, message: 'Informe o nome.' },
    {
      scenario: 'a name that is too long',
      name: 'a'.repeat(121),
      message: 'O nome deve ter no máximo 120 caracteres.',
    },
  ])('rejects $scenario', async ({ name, message }) => {
    await expect(messagesFor({ name })).resolves.toContain(message);
  });
});

describe('OptionalDescription', () => {
  it.each([42, 'a'.repeat(2001)])('rejects %p', async (description) => {
    const messages = await messagesFor({ name: 'X', description });

    expect(messages).toContain('A descrição deve ser um texto de até 2000 caracteres.');
  });
});

class Place {
  @OptionalLocation()
  public location?: unknown;
}

class Counter {
  @BoundedInteger('Valor inválido.')
  public value?: unknown;
}

async function placeMessages(location: unknown): Promise<string[]> {
  const errors = await validate(Object.assign(new Place(), { location }));
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

async function counterMessages(value: unknown): Promise<string[]> {
  const errors = await validate(plainToInstance(Counter, { value }));
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

describe('OptionalLocation', () => {
  it.each([42, 'a'.repeat(201)])('rejects %p', async (location) => {
    await expect(placeMessages(location)).resolves.toContain(
      'O local deve ser um texto de até 200 caracteres.',
    );
  });
});

describe('BoundedInteger', () => {
  it.each([0, '12', 999])('accepts %p', async (value) => {
    await expect(counterMessages(value)).resolves.toEqual([]);
  });

  it.each([-1, 1000, 1.5])('rejects %p with the given message', async (value) => {
    await expect(counterMessages(value)).resolves.toContain('Valor inválido.');
  });
});
