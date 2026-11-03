import { PasswordHasher } from './password-hasher';

describe('PasswordHasher', () => {
  const hasher = new PasswordHasher();

  it('verifies a password against its own hash', async () => {
    const hash = await hasher.hash('correct horse battery');

    await expect(hasher.verify('correct horse battery', hash)).resolves.toBe(true);
  });

  it('rejects a different password', async () => {
    const hash = await hasher.hash('correct horse battery');

    await expect(hasher.verify('wrong password', hash)).resolves.toBe(false);
  });

  it('never stores the password in clear text', async () => {
    const hash = await hasher.hash('correct horse battery');

    expect(hash).not.toContain('correct horse battery');
  });

  it('produces a different hash each time for the same password', async () => {
    const [first, second] = await Promise.all([hasher.hash('same'), hasher.hash('same')]);

    expect(first).not.toBe(second);
  });

  it.each(['', 'no-separator', ':', 'abc:'])('rejects the malformed hash "%s"', async (stored) => {
    await expect(hasher.verify('anything', stored)).resolves.toBe(false);
  });
});
