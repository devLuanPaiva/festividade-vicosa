import {
  validateEmail,
  validateName,
  validatePassword,
  type AdminAnswers,
  type Problem,
} from './admin-answers';
import type { Prompter } from './prompter';

type Validator = (value: string) => Promise<Problem> | Problem;
type EmailTakenCheck = (email: string) => Promise<boolean>;

interface Question {
  text: string;
  secret?: boolean;
}

async function askUntilValid(
  prompter: Prompter,
  question: Question,
  validate: Validator,
): Promise<string> {
  for (;;) {
    const answer = question.secret
      ? await prompter.askSecret(question.text)
      : await prompter.ask(question.text);
    const problem = await validate(answer);
    if (problem === null) {
      return answer;
    }
    prompter.show(problem);
  }
}

async function askPassword(prompter: Prompter): Promise<string> {
  for (;;) {
    const password = await askUntilValid(
      prompter,
      { text: 'Senha: ', secret: true },
      validatePassword,
    );
    const confirmation = await prompter.askSecret('Confirme a senha: ');
    if (confirmation === password) {
      return password;
    }
    prompter.show('As senhas não conferem. Digite a senha de novo.');
  }
}

export async function collectAdminAnswers(
  prompter: Prompter,
  isEmailTaken: EmailTakenCheck,
): Promise<AdminAnswers> {
  const name = await askUntilValid(prompter, { text: 'Nome completo: ' }, validateName);
  const email = await askUntilValid(prompter, { text: 'E-mail: ' }, async (value) => {
    const problem = validateEmail(value);
    if (problem !== null) {
      return problem;
    }
    return (await isEmailTaken(value.trim().toLowerCase()))
      ? 'Já existe um usuário com este e-mail.'
      : null;
  });
  const password = await askPassword(prompter);
  return { name: name.trim(), email: email.trim().toLowerCase(), password };
}
