import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { RoleCode } from '../../resources/role/enums/role-code.enum';
import { UserRepository } from '../../resources/user/repository/user.repository';
import { UserService } from '../../resources/user/services/user.service';
import { isAffirmative, type AdminAnswers } from './admin-answers';
import { collectAdminAnswers } from './collect-admin-answers';
import { PromptCancelledError, type Prompter } from './prompter';
import { TerminalPrompter } from './terminal-prompter';

const CANCELLED_EXIT_CODE = 130;

function summarize({ name, email }: AdminAnswers): string {
  return ['', 'Administrador a ser criado:', `  Nome:   ${name}`, `  E-mail: ${email}`, ''].join(
    '\n',
  );
}

async function createAdministrator(
  app: INestApplicationContext,
  prompter: Prompter,
): Promise<void> {
  const users = app.get(UserService, { strict: false });
  const repository = app.get(UserRepository, { strict: false });
  const answers = await collectAdminAnswers(
    prompter,
    async (email) => (await repository.findByEmail(email)) !== null,
  );
  prompter.show(summarize(answers));
  if (!isAffirmative(await prompter.ask('Criar este administrador? [s/N] '))) {
    prompter.show('Nada foi criado.');
    return;
  }
  await users.create(RoleCode.ADMIN, answers);
  prompter.show(`Administrador criado: ${answers.email}`);
}

async function main(): Promise<void> {
  const prompter = new TerminalPrompter();
  prompter.show('Conectando ao banco de dados...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });
  try {
    await createAdministrator(app, prompter);
  } finally {
    prompter.close();
    await app.close();
  }
}

main().catch((error: unknown) => {
  if (error instanceof PromptCancelledError) {
    process.stdout.write('\nOperação cancelada. Nada foi criado.\n');
    process.exit(CANCELLED_EXIT_CODE);
  }
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
