import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH } from '../../common/validation/validation-messages';
import { isAffirmative, validateEmail, validateName, validatePassword } from './admin-answers';

describe('admin answers', () => {
  it.each([
    ['an empty name', ''],
    ['a name with only spaces', '   '],
    ['a name above the limit', 'a'.repeat(MAX_NAME_LENGTH + 1)],
  ])('rejects %s', (_scenario, name) => {
    expect(validateName(name)).not.toBeNull();
  });

  it('accepts a name with surrounding spaces', () => {
    expect(validateName('  Ana Souza  ')).toBeNull();
  });

  it.each(['', 'ana', 'ana@', 'ana@example', 'ana souza@example.com'])(
    'rejects the e-mail "%s"',
    (email) => {
      expect(validateEmail(email)).not.toBeNull();
    },
  );

  it('accepts an e-mail with surrounding spaces', () => {
    expect(validateEmail(' ana@example.com ')).toBeNull();
  });

  it('applies the same password limits as the users endpoint', () => {
    expect(validatePassword('12345')).not.toBeNull();
    expect(validatePassword('123456')).toBeNull();
    expect(validatePassword('a'.repeat(MAX_PASSWORD_LENGTH))).toBeNull();
    expect(validatePassword('a'.repeat(MAX_PASSWORD_LENGTH + 1))).not.toBeNull();
  });

  it('keeps spaces inside the password', () => {
    expect(validatePassword('      ')).toBeNull();
  });

  it.each(['s', 'S', 'sim', ' Sim ', 'y', 'yes'])('confirms with "%s"', (answer) => {
    expect(isAffirmative(answer)).toBe(true);
  });

  it.each(['', 'n', 'não', 'talvez'])('does not confirm with "%s"', (answer) => {
    expect(isAffirmative(answer)).toBe(false);
  });
});
