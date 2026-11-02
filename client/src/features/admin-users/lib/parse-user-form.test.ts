import { describe, expect, it } from 'vitest';
import { parseUserForm, toUpdateUserPayload } from './parse-user-form';

function buildForm(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    formData.set(name, value);
  }
  return formData;
}

describe('parseUserForm', () => {
  it('trims the name and email but keeps the password exactly as typed', () => {
    const values = parseUserForm(
      buildForm({ name: '  Ana ', email: ' ana@x.com ', password: ' segredo ', roleId: 'g-1' }),
    );

    expect(values).toEqual({
      name: 'Ana',
      email: 'ana@x.com',
      password: ' segredo ',
      roleId: 'g-1',
    });
  });
});

describe('toUpdateUserPayload', () => {
  it('does not send the password when the field was left empty', () => {
    const values = parseUserForm(buildForm({ name: 'Ana', email: 'ana@x.com', password: '' }));

    expect(toUpdateUserPayload(values)).toEqual({ name: 'Ana', email: 'ana@x.com' });
  });

  it('sends the new password when one was typed', () => {
    const values = parseUserForm(
      buildForm({ name: 'Ana', email: 'ana@x.com', password: 'nova123' }),
    );

    expect(toUpdateUserPayload(values)).toMatchObject({ password: 'nova123' });
  });
});
