import { collectAdminAnswers } from './collect-admin-answers';
import type { Prompter } from './prompter';

interface ScriptedPrompter extends Prompter {
  shown: string[];
}

function scriptedPrompter(answers: string[]): ScriptedPrompter {
  const remaining = [...answers];
  const next = (): Promise<string> => Promise.resolve(remaining.shift() ?? '');
  const shown: string[] = [];
  return {
    shown,
    ask: next,
    askSecret: next,
    show: (message: string): void => {
      shown.push(message);
    },
  };
}

const neverTaken = (): Promise<boolean> => Promise.resolve(false);

describe('collectAdminAnswers', () => {
  it('returns the answers with the e-mail in lower case so it matches the login', async () => {
    const prompter = scriptedPrompter(['  Ana Souza ', ' Ana@Example.com ', 'secret1', 'secret1']);

    await expect(collectAdminAnswers(prompter, neverTaken)).resolves.toEqual({
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: 'secret1',
    });
  });

  it('asks again for an invalid e-mail and keeps the earlier answers', async () => {
    const prompter = scriptedPrompter([
      'Ana',
      'ana-at-example',
      'ana@example.com',
      'secret1',
      'secret1',
    ]);

    const answers = await collectAdminAnswers(prompter, neverTaken);

    expect(answers.email).toBe('ana@example.com');
    expect(prompter.shown).toEqual(['Informe um e-mail válido.']);
  });

  it('does not accept an e-mail that already belongs to a user', async () => {
    const prompter = scriptedPrompter([
      'Ana',
      'taken@example.com',
      'free@example.com',
      'secret1',
      'secret1',
    ]);
    const isEmailTaken = (email: string): Promise<boolean> =>
      Promise.resolve(email === 'taken@example.com');

    const answers = await collectAdminAnswers(prompter, isEmailTaken);

    expect(answers.email).toBe('free@example.com');
    expect(prompter.shown).toEqual(['Já existe um usuário com este e-mail.']);
  });

  it('asks for the whole password again when the confirmation differs', async () => {
    const prompter = scriptedPrompter([
      'Ana',
      'ana@example.com',
      'secret1',
      'secret2',
      'final-pass',
      'final-pass',
    ]);

    const answers = await collectAdminAnswers(prompter, neverTaken);

    expect(answers.password).toBe('final-pass');
    expect(prompter.shown).toEqual(['As senhas não conferem. Digite a senha de novo.']);
  });

  it('asks again for a password that is too short before asking to confirm it', async () => {
    const prompter = scriptedPrompter(['Ana', 'ana@example.com', '123', 'secret1', 'secret1']);

    const answers = await collectAdminAnswers(prompter, neverTaken);

    expect(answers.password).toBe('secret1');
    expect(prompter.shown).toHaveLength(1);
  });
});
